import {inject} from '@loopback/core';
import * as winston from 'winston';
import {bindObjects} from '../application';
import {IncentiveConstants} from '../constants-enum';
import {IncentiveErrorCode} from '../error-codes';
import {CampaignHelper} from '../helpers';
/* models */
import {
  Campaign,
  Incentive,
  Sequelize,
  SequelizeTypescript,
  Voucher,
} from '../models';
import {IncenitveRequestType} from '../types';

const Op = Sequelize.Op;

export class IncentiveBL {
  constructor(
    @inject('sequelize') private sequelize: SequelizeTypescript,
    @inject('logger') private logger: winston.Logger,
  ) {}

  /**
   * Helpers
   */
  @bindObjects('campaignHelper', CampaignHelper)
  private campaignHelper: CampaignHelper;

  private requestIncetive: IncenitveRequestType;
  private mandatoryValidationErrors: {[index: string]: string} = {};

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
    this.mandatoryValidationErrors = IncentiveErrorCode.getErrors(
      this.mandatoryValidationErrors,
      key,
      errorCode,
      parameters,
    );
  }

  /**
   * Mandatory Field Validation
   */
  async mandatoryFieldValidation(incentiveId?: number) {
    const {name, campaignId, startDateTime, endDateTime, incentiveType} =
      this.requestIncetive;

    if (!name) {
      this.mandatoryValidationError('name', 'NAME_REQUIRED');
    }

    if (!incentiveType) {
      this.mandatoryValidationError('incentiveType', 'INCENTIVE_TYPE_REQUIRED');
    }

    if (!campaignId) {
      this.mandatoryValidationError('campaignId', 'CAMPAIGN_REQUIRED');
    }

    if (!startDateTime) {
      this.mandatoryValidationError('startDateTime', 'START_DATE_REQUIRED');
    }

    if (!endDateTime) {
      this.mandatoryValidationError('endDateTime', 'END_DATE_REQUIRED');
    }
  }

  /**
   * Validate Incentive
   * @param incentive
   */
  async validateIncentive(
    incentive: IncenitveRequestType,
    incentiveId?: number,
  ) {
    this.requestIncetive = incentive;

    let errors = null;
    const isPublishedEdited = false;
    await this.mandatoryFieldValidation(incentiveId);

    if (Object.keys(this.mandatoryValidationErrors).length > 0) {
      errors = this.mandatoryValidationErrors;
    } else {
    }

    if (errors) {
      throw IncentiveErrorCode.errors(errors);
    }
  }

  /**
   * Get Distribution Type
   *
   * @param incentive
   */
  async getDistributionType(incentive: IncenitveRequestType): Promise<string> {
    const distributionArray = [];
    const {voucher} = incentive;

    for (const [key, value] of Object.entries({voucher})) {
      switch (value !== null ? key.toUpperCase() : '') {
        case IncentiveConstants.VOUCHER:
          distributionArray.push(IncentiveConstants.VOUCHER);
          break;
        default:
          break;
      }
    }
    return distributionArray.join(',');
  }

  /**
   * Create Incentive
   *
   * @param incentive
   */
  async create(incentive: IncenitveRequestType) {
    const isDraft = true;
    await this.validateIncentive(incentive);

    Object.assign(incentive, {
      updateBy: 'admin',
      workFlowStatus: 1,
      distributionType: await this.getDistributionType(incentive),
    });

    let incentiveId = 0;

    try {
      const transaction = await this.sequelize.transaction();
      try {
        const incentiveDetails = await Incentive.create(incentive, {
          transaction,
        });
        incentiveId = incentiveDetails.id;

        if (incentive.voucher) {
          Object.assign(incentive.voucher, {
            updateBy: 'admin',
            incentiveId,
          });
          await Voucher.create(incentive.voucher, {transaction});
        }

        await transaction.commit();

        if (isDraft) {
          await this.campaignHelper.updateIncentivesCount(incentive.campaignId);
        }

        return incentiveId;
      } catch (err) {
        await transaction.rollback();
        this.logger.error('Incentive Create', err);
        throw IncentiveErrorCode.error(err.message);
      }
    } catch (err) {
      this.logger.error('Incentive Create', err);
      throw IncentiveErrorCode.error(err.message);
    }
  }

  /**
   * Get Incentive By Id
   *
   * @param id
   */
  async get(id: number) {
    const incentiveDetails = await Incentive.scope('includeEverything').findOne(
      {
        where: {id},
        include: [
          {
            as: 'campaign',
            attributes: [
              'id',
              'name',
              'description',
              'startDateTime',
              'endDateTime',
              'campaignType',
              'budgetAmount',
              'workFlowStatus',
              'isValid',
              'incentiveCount',
              'timeZoneId',
            ],
            model: Campaign.scope('includeEverything'),
            required: false,
          },
        ],
      },
    );

    if (!incentiveDetails) {
      throw IncentiveErrorCode.error('INCENTIVE_NOT_FOUND', [id]);
    }

    return incentiveDetails;
  }
}
