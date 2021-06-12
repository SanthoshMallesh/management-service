import {inject} from '@loopback/core';
import * as winston from 'winston';
/* application  */
import {bindObjects} from '../application';
/* Constant */
import {Constants} from '../constants';
import {workFlowStatus} from '../constants/workFlowStatus';
/* error-codes */
import {CampaignErrorCode} from '../error-codes/campaign.errorCode';
/* Helper */
import {CampaignHelper} from '../helpers';
/* models */
import {
  Campaign,
  CampaignChannel,
  Channel,
  Sequelize,
  SequelizeTypescript,
} from '../models';
/* Types */
import {CampaignRequestType} from '../types/campaign.type';

const Op = Sequelize.Op;

export interface ChannelList {
  id: number;
  name: string;
}
export interface ResponseCampaign {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budgetAmount: number;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  workFlowStatus: number;
  campaignType: string;
  channels: ChannelList[];
}

export class CampaignBL {
  constructor(
    @inject('sequelize') private sequelize: SequelizeTypescript,
    @inject('logger') private logger: winston.Logger,
  ) {}

  /**
   * Helpers
   */
  @bindObjects('campaignHelper', CampaignHelper)
  private campaignHelper: CampaignHelper;

  @inject('constants') private constants: Constants;

  private requestCampaign: CampaignRequestType;

  private mandatoryValidationErrors: {[index: string]: string} = {};
  private validationErrors: {[index: string]: string} = {};

  /**
   * Mandatory Validation Error
   * @param key
   * @param errorCode
   * @param parameters
   */
  async mandatoryValidationError(
    key: string,
    errorCode: string,
    parameters: string[] | number[] = [],
  ) {
    this.mandatoryValidationErrors = CampaignErrorCode.getErrors(
      this.mandatoryValidationErrors,
      key,
      errorCode,
      parameters,
    );
  }

  /**
   * Mandatory Field Validation
   */
  async mandatoryFieldValidation() {
    const {name, startDateTime, endDateTime, channels, budgetAmount} =
      this.requestCampaign;

    if (!channels || channels.length === 0) {
      this.mandatoryValidationError('channels', 'CHANNELS_REQUIRED');
    }

    if (!startDateTime) {
      this.mandatoryValidationError('startDateTime', 'START_DATE_REQUIRED');
    }

    if (!endDateTime) {
      this.mandatoryValidationError('endDateTime', 'END_DATE_REQUIRED');
    }
  }

  /**
   * Validate Campaign
   * @param campaign
   */
  async validateCampaign(campaign: CampaignRequestType) {
    this.requestCampaign = campaign;

    let errors = null;
    await this.mandatoryFieldValidation();

    if (Object.keys(this.mandatoryValidationErrors).length > 0) {
      errors = this.mandatoryValidationErrors;
    }

    if (errors) {
      throw CampaignErrorCode.errors(errors);
    }
  }

  /**
   * Create Campaign
   *
   * @param campaign
   * @returns
   */
  async create(campaign: CampaignRequestType) {
    this.logger.info('Campaign BL - Campaign create ');
    await this.validateCampaign(campaign);

    const {channels} = campaign;

    campaign = Object.assign({}, campaign, {
      createdBy: 'admin',
      updatedBy: 'admin',
    });
    let campaignId = 0;
    try {
      const transaction = await this.sequelize.transaction();
      try {
        const campaignDetails = await Campaign.create(campaign, {transaction});
        campaignId = campaignDetails.id;
        if (channels) {
          const channelIds = [...new Set(channels)];
          const channelList = channelIds.map((channelId: number) => ({
            channelId,
            campaignId,
            createdBy: 'admin',
            updatedBy: 'admin',
          }));
          await CampaignChannel.bulkCreate(channelList, {transaction});
        }

        await transaction.commit();
        return campaignId;
      } catch (err) {
        this.logger.error('Campaign create ', err);
        await transaction.rollback();
        throw CampaignErrorCode.error(err.message);
      }
    } catch (err) {
      this.logger.error('Campaign BL - Campaign create ', err);
      throw CampaignErrorCode.error(err.message);
    }
  }

  /**
   * Validate For Publish
   *
   * @param campaignId
   */
  async validateForPublish(campaignId: number) {
    await this.campaignHelper.validateForPublish(campaignId);
  }

  /**
   * Get campaign details
   *
   * @param campaignId
   */
  async get(campaignId: number) {
    const cmapaignDetails = await Campaign.scope('includeEverything').findOne({
      where: {
        id: campaignId,
      },
      attributes: [
        'id',
        'name',
        'description',
        'startDateTime',
        'endDateTime',
        'incentiveCount',
        'campaignType',
        'budgetAmount',
        'workFlowStatus',
        'isValid',
        'errorDescription',
        'createdBy',
        'createdDate',
      ],
    });

    if (!cmapaignDetails) {
      throw CampaignErrorCode.error('CAMPAIGN_NOT_FOUND', [campaignId]);
    }

    return cmapaignDetails;
  }

  /**
   * Campaign Update
   *
   * @param campaignId
   * @param campaign
   */
  async update(campaignId: number, campaign: CampaignRequestType) {
    const campaignDeatails = await Campaign.findOne({
      where: {id: campaignId},
      attributes: ['id', 'startDateTime', 'endDateTime', 'workFlowStatus'],
      include: [
        {
          as: 'channels',
          attributes: ['id'],
          model: Channel,
          required: true,
        },
      ],
    });

    if (!campaignDeatails) {
      throw CampaignErrorCode.error('CAMPAIGN_NOT_FOUND', [campaignId]);
    }

    const allowedCampaignWorkFlowStatus = [
      this.constants.statuses.DRAFT,
      this.constants.statuses.PUBLISHED,
    ];

    const workFlowStatusCheck = Object.keys(this.constants.statuses).find(
      key => this.constants.statuses[key] === campaignDeatails.workFlowStatus,
    );
    if (
      !allowedCampaignWorkFlowStatus.includes(campaignDeatails.workFlowStatus)
    ) {
      throw CampaignErrorCode.error('UPDATE_EXPIRED_CAMPAIGN', [
        campaignId,
        workFlowStatusCheck!,
      ]);
    }

    if (campaignDeatails.workFlowStatus === this.constants.statuses.DRAFT) {
      await this.validateCampaign(campaign);
    }

    const {channels} = campaign;

    const existingChannels = campaignDeatails.channels.map(
      (existingChannel: Channel) => existingChannel.id,
    );

    const channelIds = [...new Set(channels)];

    const newChannels = channelIds.filter(
      channel => existingChannels.indexOf(channel) < 0,
    );

    const deleteChannels = existingChannels.filter(
      (existingChannel: number) => channelIds.indexOf(existingChannels) < 0,
    );

    campaign = Object.assign({}, campaign, {
      updatedBy: 'admin',
      workFlowStatus: workFlowStatus.DRAFT,
    });

    let transaction;

    try {
      transaction = await this.sequelize.transaction();
      try {
        await Campaign.update(campaign, {where: {id: campaignId}, transaction});

        if (newChannels.length > 0) {
          const channelList = newChannels.map((channelId: number) => ({
            channelId,
            campaignId,
            enabled: true,
            updateBy: 'admin',
          }));

          await CampaignChannel.bulkCreate(channelList, {transaction});
        }

        if (deleteChannels.length > 0) {
          await CampaignChannel.destroy({
            where: {campaignId, channelId: {[Op.in]: deleteChannels}},
            transaction,
            force: true,
          });
        }

        await transaction.commit();
        return campaignId;
      } catch (err) {
        await transaction.rollback();
        this.logger.error('Campaign update : ', err);
        throw CampaignErrorCode.error(err.message);
      }
    } catch (err) {
      this.logger.error('Campaign update : ', err);
      throw CampaignErrorCode.error(err.message);
    }
  }

  /**
   * Process Campaign
   *
   * @param campaign
   */
  static processCampaign(campaign: Campaign) {
    const data: ResponseCampaign = {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      startDate: campaign.startDateTime,
      endDate: campaign.endDateTime,
      budgetAmount: campaign.budgetAmount,
      createdBy: campaign.createdBy,
      updatedBy: campaign.updatedBy,
      createdDate: campaign.createdDate,
      updatedDate: campaign.updatedDate,
      workFlowStatus: campaign.workFlowStatus,
      campaignType: campaign.campaignType,
      channels: campaign.channels.map((channel: Channel) => ({
        id: channel.id,
        name: channel.name,
      })),
    };

    return data;
  }

  /**
   * Delete Campaigns
   *
   * @param campaignIds
   */
  async deleteCampaigns(campaignIds: number[]) {
    if (campaignIds.length === 0) {
      throw CampaignErrorCode.error('CAMPAIGNS_REQUIRED');
    }

    const selectedCampaigns = await Campaign.findAll({
      attributes: ['id'],
      where: {
        workFlowStatus: this.constants.statuses.DRAFT,
        id: {[Op.in]: campaignIds},
      },
    });

    const selectedCampaignIds = selectedCampaigns.map(
      (selectedCampaign: Campaign) => selectedCampaign.id,
    );

    const notFoundedCampaignsIds = campaignIds.filter(
      campaignId => selectedCampaignIds.indexOf(campaignId) < 0,
    );

    if (notFoundedCampaignsIds.length > 0) {
      throw CampaignErrorCode.error('DRAFT_CAMPAIGNS_NOT_FOUND', [
        notFoundedCampaignsIds.join(','),
      ]);
    }
    try {
      const transaction = await this.sequelize.transaction();
      try {
        await CampaignChannel.destroy({
          where: {campaignId: {[Op.in]: campaignIds}},
          transaction,
        });
        await Campaign.destroy({
          where: {id: {[Op.in]: campaignIds}},
          transaction,
        });
        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
        this.logger.error('Campaign delete : ', err);
        throw CampaignErrorCode.error(err.message);
      }
    } catch (err) {
      this.logger.error('Campaign delete : ', err);
      throw CampaignErrorCode.error(err.message);
    }
  }
}
