import {inject} from '@loopback/core';
import * as winston from 'winston';
/* application  */
import {bindObjects} from '../application';
/* error-codes */
import {CampaignErrorCode} from '../error-codes/campaign.errorCode';
/* Helper */
import {CampaignHelper} from '../helpers';
/* models */
import {Campaign, CampaignChannel, SequelizeTypescript} from '../models';
/* Types */
import {CampaignRequestType} from '../types/campaign.type';

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
}
