import {inject} from '@loopback/core';
import * as winston from 'winston';
/* application  */
import {bindObjects} from '../application';
/* Constant */
import {Constants} from '../constants';
import {workFlowStatus} from '../constants/workFlowStatus';
import {DefaultErrorCode} from '../error-codes';
/* error-codes */
import {CampaignErrorCode} from '../error-codes/campaign.errorCode';
/* Helper */
import {CampaignHelper} from '../helpers';
/* models */
import {
  Campaign,
  CampaignChannel,
  Channel,
  SequelizeTypescript,
  WorkFlow,
} from '../models';
/* Types */
import {CampaignRequestType} from '../types/campaign.type';
import Sequelize = require('sequelize');
const Op = Sequelize.Op;

export interface ChannelList {
  id: number;
  name: string;
}

interface OptionInterface {
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
  budgetCode: string;
  webStatus: OptionInterface | null;
  requesterAction: OptionInterface | null;
  approverAction: OptionInterface | null;
  workflowStatus: number;
  campaignType: string;
  channels: ChannelList[];
  campaignImage: string;
  isEdited: boolean | null;
  isValid: boolean;
  consumerParticipationLimit: number;
  campaignParticipationLimit: number | null;
  timeZoneAbbr: string | null;
  timeZone: string | null;
  incentiveCount: number | null;
  childrenCampaigns?: ResponseCampaign[] | null;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
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

    const {channels, requesterAction, approverAction, timeZoneId} = campaign;
    const DRAFT_STATUS = 1;
    campaign = Object.assign({}, campaign, {
      createdBy: 'admin',
      updatedBy: 'admin',
      requesterAction: requesterAction === 0 ? null : requesterAction,
      approverAction: approverAction === 0 ? null : approverAction,
      webStatus: DRAFT_STATUS,
      timeZoneId: timeZoneId === 0 ? null : timeZoneId,
      isEdited: true,
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
        'campaignType',
        'description',
        'startDateTime',
        'endDateTime',
        'budgetAmount',
        'budgetCode',
        'webStatus',
        'workflowStatus',
        'incentiveCount',
        'timeZoneId',
        'isValid',
        'isEdited',
        'requesterAction',
        'approverAction',
        'errorDescription',
        'consumerParticipationLimit',
        'campaignParticipationLimit',
        'campaignImage',
        'createdBy',
        'createdDate',
        'updatedBy',
        'updatedDate',
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
      attributes: ['id', 'startDateTime', 'endDateTime', 'webStatus'],
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

    const allowedCampaignWebStatus = [
      this.constants.statuses.DRAFT,
      this.constants.statuses.PUBLISHED,
    ];

    const webStatus = Object.keys(this.constants.statuses).find(
      key => this.constants.statuses[key] === campaignDeatails.webStatus,
    );
    if (!allowedCampaignWebStatus.includes(campaignDeatails.webStatus)) {
      throw CampaignErrorCode.error('UPDATE_EXPIRED_CAMPAIGN', [
        campaignId,
        webStatus!,
      ]);
    }

    if (campaignDeatails.webStatus === this.constants.statuses.DRAFT) {
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
      (existingChannel: number) => channelIds.indexOf(existingChannel) < 0,
    );

    campaign = Object.assign({}, campaign, {
      updatedBy: 'admin',
      workflowStatus: workFlowStatus.DRAFT,
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
      budgetCode: campaign.budgetCode,
      workflowStatus: campaign.workflowStatus,
      incentiveCount: campaign.incentiveCount,
      campaignImage: campaign.campaignImage,
      campaignType: campaign.campaignType,
      timeZoneAbbr: campaign.timeZone ? campaign.timeZone.timeZoneName : null,
      timeZone: campaign.timeZone ? campaign.timeZone.timeZoneName : null,
      channels: campaign.channels.map((channel: Channel) => ({
        id: channel.id,
        name: channel.name,
      })),
      requesterAction: campaign.requester
        ? {id: campaign.requester.id, name: campaign.requester.status}
        : null,
      approverAction: campaign.approver
        ? {id: campaign.approver.id, name: campaign.approver.status}
        : null,
      webStatus: campaign.status
        ? {id: campaign.status.id, name: campaign.status.status}
        : null,
      isEdited: campaign.isEdited,
      isValid: campaign.isValid,
      consumerParticipationLimit: campaign.consumerParticipationLimit,
      campaignParticipationLimit: campaign.campaignParticipationLimit
        ? campaign.campaignParticipationLimit
        : null,
      createdBy: campaign.createdBy,
      updatedBy: campaign.updatedBy,
      createdDate: campaign.createdDate,
      updatedDate: campaign.updatedDate,
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
        webStatus: this.constants.statuses.DRAFT,
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

  /**
   * Convert Filter Param To Array
   * @param filter
   * @param filterQueryField
   * @param isNumber
   * @returns
   */
  private async convertFilterParamToArray(
    filter: object,
    filterQueryField: string,
    isNumber: boolean,
  ) {
    const filterOptions = filter as {[prop: string]: {[prop: string]: string}};

    if (filterOptions[filterQueryField] && filterOptions[filterQueryField].in) {
      return filterOptions[filterQueryField].in.split(',').map(queryParam => {
        return isNumber ? +queryParam : queryParam;
      });
    }

    return [];
  }

  private async convertFilterQueryParamToArray(
    filter: object,
    filterQueryField: string,
    isNumber: boolean,
  ) {
    const filterOptions = filter as {[prop: string]: {[prop: string]: string}};

    if (filterOptions[filterQueryField] && filterOptions[filterQueryField].in) {
      return filterOptions[filterQueryField].in.split(',').map(queryParam => {
        return isNumber ? +queryParam : queryParam;
      });
    }

    return [];
  }

  /**
   * Get Search Filter Query
   * @param type
   * @param filterObj
   * @param filter
   * @param search
   * @param status
   */
  private async getSearchFilterQuery(
    type: string,
    filterObj: Sequelize.WhereAttributeHash | null,
    filter?: object,
    search?: string,
    status?: number,
  ) {
    const campaignWhere: Sequelize.WhereAttributeHash = {};
    const incentiveWhere: Sequelize.WhereAttributeHash = {};

    const userChannelIds = [2869];
    const userMpIds = [20];

    let channelIds: number[] = [];
    let mpIds: number[] = [];
    let distributionTypes: string[] = [];
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let distributionTypeCondition: any = new Object({});

    const nameSearchCondition = [];

    if (type && type.toUpperCase() === 'INCENTIVE') {
      if (search) {
        if (parseInt(search, 10).toString() === search.replace(/^0+/, '')) {
          nameSearchCondition.push({id: `${parseInt(search, 10)}`});
          nameSearchCondition.push({incentiveId: {[Op.like]: `%${search}%`}});
        }
        nameSearchCondition.push({name: {[Op.iLike]: `%${search}%`}});
        incentiveWhere.$or = nameSearchCondition;
      }

      if (filterObj) {
        incentiveWhere.$and = filterObj;
      }

      if (status) {
        incentiveWhere.workFlowStatus = status;
      }

      if (filter) {
        distributionTypes = <string[]>(
          await this.convertFilterParamToArray(
            filter,
            'distributionType',
            false,
          )
        );
      }

      if (distributionTypes.length !== 0) {
        distributionTypeCondition = {
          $or: distributionTypes.map(disType => ({
            id: {
              $in: Sequelize.literal(
                `(SELECT "incentiveId" FROM ${disType.toLowerCase()})`,
              ),
            },
          })),
        };
      }

      const filterCondition = [];
      if (filterObj && Object.keys(filterObj).length) {
        filterCondition.push(filterObj);
      }
      if (
        distributionTypeCondition &&
        Object.keys(distributionTypeCondition).length
      ) {
        filterCondition.push(distributionTypeCondition);
      }

      incentiveWhere.$and = filterCondition;

      const QueryGenerator = this.sequelize.getQueryInterface() //eslint-disable-next-line @typescript-eslint/no-explicit-any
        .QueryGenerator as any;

      const incentiveSubQuery: string = QueryGenerator.selectQuery(
        'incentive',
        {
          attributes: ['campaignId'],
          where: incentiveWhere,
        },
      );

      campaignWhere.id = {
        $in: Sequelize.literal(`(${incentiveSubQuery.slice(0, -1)})`),
      };
    } else if (type && type.toUpperCase() === 'CAMPAIGN') {
      if (search) {
        if (parseInt(search, 10).toString() === search) {
          nameSearchCondition.push({id: parseInt(search, 10)});
        }
        nameSearchCondition.push({
          id: {
            [Op.in]: Sequelize.literal(`
            (with getFirstKey as(SELECT keys FROM (SELECT keys,row_number() over(order by (select 1)) rn FROM (SELECT name,json_object_keys(name) keys FROM campaign) t1) t1 where rn = 1)select id from campaign where CAST(name->(select keys from getFirstKey) as text) iLike '%${search}%')`),
          },
        });
        campaignWhere.$or = nameSearchCondition;
      }
      if (filterObj) {
        campaignWhere.$and = filterObj;
      }

      if (status) {
        campaignWhere.webStatus = status;
      }
    }

    if (filter) {
      channelIds = <number[]>(
        await this.convertFilterQueryParamToArray(filter, 'channel', true)
      );
      mpIds = <number[]>(
        await this.convertFilterQueryParamToArray(filter, 'mp', true)
      );
    }
    const allowedChannelIDs = channelIds.filter(channelId => {
      userChannelIds.includes(channelId);
    });

    const allowedMPIDs = mpIds.filter(mpId => userMpIds.includes(mpId));

    const channelIdsList =
      allowedChannelIDs.length > 0 ? allowedChannelIDs : userChannelIds;

    const mpidsList = allowedMPIDs.length > 0 ? allowedMPIDs : userMpIds;

    campaignWhere['$Campaign.id$'] = {
      $in: Sequelize.literal(
        `(SELECT campaign.id from campaign INNER JOIN campaign_channel on campaign_channel."campaignId" = campaign.id INNER JOIN channel on channel.id = campaign_channel."channelId" where campaign_channel."channelId" IN (${channelIdsList.join(
          ',',
        )}) AND channel."mktngPgmId" IN (${mpidsList.join(',')}))`,
      ),
    };

    return {
      campaignWhere,
      channelIds: channelIdsList,
      mpIds: mpidsList,
    };
  }

  formatFilter(
    filter?: object,
    allowedFilters: string[] = [],
    ignoredFilters: string[] = [],
  ) {
    if (!filter) {
      return null;
    }

    const filterParams = Object.keys(filter);

    const additionalFilters = filterParams.filter(filterParam => {
      if (!ignoredFilters.includes(filterParam)) {
        return !allowedFilters.includes(filterParam);
      }
    });

    if (additionalFilters.length > 0) {
      throw DefaultErrorCode.error('INVALID_FILTER', [
        additionalFilters.join(', '),
      ]);
    }

    const whereFilter = {} as Sequelize.WhereAttributeHash;
    const filterObject = filter as {
      [index: string]: string | {[index: string]: string};
    };

    filterParams.forEach(filterParam => {
      if (!ignoredFilters.includes(filterParam)) {
        const filterValue = filterObject[filterParam];
        if (typeof filterValue == 'string' && filterValue) {
          whereFilter[filterParam] = filterValue;
        } else if (typeof filterValue === 'object') {
          const key = Object.keys(filterValue)[0];

          let value: string | string[] = filterValue[key];
          if (value) {
            if (['in', 'notIn'].includes(key)) {
              value = filterValue[key].split(',');
            }

            whereFilter[filterParam] = {
              [`${key}`]: value,
            };
          }
        }
      }
    });

    return whereFilter;
  }

  /**
   * Campaign List
   * @param params
   */
  async list(params: {
    sort: string;
    sortDir: string;
    type: string;
    page: number;
    limit: number;
    status?: number;
    search?: string;
    filter?: object;
  }) {
    const {sort, sortDir, type, page, limit, status, search, filter} = params;

    const sortableFields = {
      id: {column: 'id'},
      name: {column: 'name'},
      startDate: {column: 'startDateTime'},
      endDate: {column: 'endDateTime'},
      status: {model: {model: WorkFlow, as: 'status'}, column: 'status'},
      updatedDate: {column: 'updatedDate'},
      updatedBy: {column: 'updatedBy'},
    };

    if (!Object.keys(sortableFields).includes(sort)) {
      throw CampaignErrorCode.error('INVALID_SORT', [sort]);
    }

    const sortOrders = ['ASC', 'DESC'];

    if (!sortOrders.includes(sortDir.toUpperCase())) {
      throw CampaignErrorCode.error('INVALID_SORT_DIRECTION', [sortDir]);
    }

    const filterObj = this.formatFilter(
      filter,
      ['startDateTime', 'endDateTime', 'webStatus', 'campaignType'],
      ['channel', 'mp', 'distributionType'],
    );

    let statusSort = null;
    if (sort === 'status') {
      const statusOrder = Object.values(this.constants.statuses);
      if (sortDir.toUpperCase() === 'DESC') {
        statusOrder.reverse();
      }

      statusSort = Sequelize.literal(
        `CASE ${statusOrder
          .map(
            (statusId, index) =>
              `WHEN "Campaign"."webStatus" = ${statusId} THEN ${index}`,
          )
          .join(' ')} END`,
      );
    }

    const campaignAttributes = [
      'id',
      'name',
      'description',
      'startDateTime',
      'endDateTime',
      'budgetAmount',
      'budgetCode',
      'webStatus',
      'workflowStatus',
      'requesterAction',
      'incentiveCount',
      'isEdited',
      'isValid',
      'timeZoneId',
      'approverAction',
      'consumerParticipationLimit',
      'campaignParticipationLimit',
      'campaignType',
      'createdDate',
      'updatedDate',
      'createdBy',
    ];

    try {
      const filterQueryDetails = await this.getSearchFilterQuery(
        type,
        filterObj,
        filter,
        search,
        status,
      );

      const count = await Campaign.scope('includeEverything').count({
        where: filterQueryDetails.campaignWhere,
        distinct: true,
        col: 'Campaign.id',
      });

      const campaigns = await Campaign.scope('includeEverything').findAll({
        attributes: campaignAttributes,
        offset: (page - 1) * limit,
        where: filterQueryDetails.campaignWhere,
        limit,
      });

      const data = campaigns.map(CampaignBL.processCampaign);

      return {count, page, limit, totalPages: Math.ceil(count / limit), data};
    } catch (err) {
      this.logger.error('Campaign List : ', err);
      throw CampaignErrorCode.error(err.message);
    }
  }
}
