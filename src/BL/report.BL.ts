import {inject} from '@loopback/core';
import * as winston from 'winston';
import {Constants} from '../constants';
import {
  Campaign,
  Channel,
  Incentive,
  MarketingProgram,
  SequelizeTypescript,
  Voucher,
} from '../models';
import {Coupon} from '../models/coupon.model';
import Sequelize = require('sequelize');

export interface ReportFilters {
  mktngPgmNbr: number;
  distributionType: string;
  startDateTime: string;
  endDateTime: string;
  filterBy?: string;
  channelIds?: string;
  groupByDate?: boolean;
}

interface VoucherResults {
  reservedCoupons: number | Array<{date: string; value: string}>;
  redeemedCoupons: number | Array<{date: string; value: string}>;
  totalCashbackPaid: Array<{
    channelId: number;
    amount: number;
  }>;
}

export class ReportBL {
  constructor(@inject('sequelize') private sequelize: SequelizeTypescript) {}

  @inject('logger') private logger: winston.Logger;
  @inject('constants') private constants: Constants;

  async getStatusList() {
    return [
      this.constants.statuses.DRAFT,
      this.constants.statuses.PUBLISHED,
      this.constants.statuses.UNPUBLISHED,
      this.constants.statuses.EXPIRED,
      this.constants.statuses.DISABLED,
    ];
  }

  /**
   * Get Campaign Status Count
   * @param mktngPgmId
   * @param startDateTime
   * @param endDateTime
   * @param status
   * @param channelIds
   * @returns
   */
  async getCampaignStatusCount(
    mktngPgmId: number,
    startDateTime: string,
    endDateTime: string,
    status: number,
    channelIds?: string,
  ) {
    this.logger.info('getCampaignStatusCount: ', mktngPgmId);
    const where: Sequelize.WhereAttributeHash = {
      mktngPgmId: {
        $in: Sequelize.literal(
          `(SELECT id from "marketing_program" WHERE "mktngPgmNbr" = '${mktngPgmId}')`,
        ),
      },
    };

    if (channelIds) {
      where.id = {
        $in: channelIds.split(','),
      };
    }

    return Campaign.count({
      include: [
        {
          as: 'channels',
          model: Channel,
          where,
          required: true,
          include: [
            {
              as: 'marketingProgram',
              model: MarketingProgram,
              required: true,
            },
          ],
        },
      ],
      where: {
        workFlowStatus: status,
        $and: Sequelize.literal(
          `("Campaign"."startDateTime", "Campaign"."endDateTime") OVERLAPS ('${startDateTime}','${endDateTime}')`,
        ),
      },
    });
  }

  /**
   * Get Incentive Status Count
   * @param mktngPgmId
   * @param startDateTime
   * @param endDateTime
   * @param status
   * @param channelIds
   * @returns
   */
  async getIncentiveStatusCount(
    mktngPgmId: number,
    startDateTime: string,
    endDateTime: string,
    status: number,
    channelIds?: string,
  ) {
    this.logger.info('getIncentiveStatusCount: ', mktngPgmId);
    const where: Sequelize.WhereAttributeHash = {
      workFlowStatus: status,
      $and: Sequelize.literal(
        `("Incentive"."startDateTime", "Incentive"."endDateTime") OVERLAPS ('${startDateTime}','${endDateTime}')`,
      ),
      '$campaign.channels.mktngPgmId$': {
        $in: Sequelize.literal(
          `(SELECT id from "marketing_program" WHERE "mktngPgmNbr" = '${mktngPgmId}')`,
        ),
      },
    };

    if (channelIds) {
      where['$campaign.channels.id$'] = {
        $in: channelIds.split(','),
      };
    }

    return Incentive.count({
      include: [
        {
          as: 'campaign',
          model: Campaign.scope('includeEverything'),
          required: true,
        },
      ],
      where,
    });
  }

  /**
   * Get Campaign Incentive Status Details
   *
   * @param mktngPgmNbr
   * @param startDateTime
   * @param endDateTime
   * @param channelIds
   */
  async getCampaignIncentiveStatusDetails(
    mktngPgmId: number,
    startDateTime: string,
    endDateTime: string,
    statusType: string,
    channelIds?: string,
  ) {
    this.logger.info('BL Get Campaign Status Count: Started');
    let draftCount = 0;
    let publishCount = 0;
    let pauseCount = 0;
    let disabledCount = 0;
    let expiredCount = 0;
    let count = 0;
    const statusList = await this.getStatusList();

    await Promise.all(
      statusList.map(async statusId => {
        if (statusType === 'campaign') {
          count = await this.getCampaignStatusCount(
            mktngPgmId,
            startDateTime,
            endDateTime,
            statusId,
            channelIds,
          );
        } else {
          count = await this.getIncentiveStatusCount(
            mktngPgmId,
            startDateTime,
            endDateTime,
            statusId,
            channelIds,
          );
        }

        if (statusId === this.constants.statuses.DRAFT) {
          draftCount = count;
        } else if (statusId === this.constants.statuses.PUBLISHED) {
          publishCount = count;
        } else if (statusId === this.constants.statuses.UNPUBLISHED) {
          pauseCount = count;
        } else if (statusId === this.constants.statuses.EXPIRED) {
          expiredCount = count;
        } else {
          disabledCount = count;
        }
      }),
    );

    return {
      draft: draftCount,
      publish: publishCount,
      disable: disabledCount,
      expired: expiredCount,
    };
  }

  /**
   * Get Distribution Type Status Count
   * @param mktngPgmId
   * @param startDateTime
   * @param endDateTime
   * @param status
   * @param distributionType
   * @param channelIds
   * @returns
   */
  async getDistributionTypeStatusCount(
    mktngPgmId: number,
    startDateTime: string,
    endDateTime: string,
    status: number,
    distributionType: string,
    channelIds?: string,
  ) {
    this.logger.info('getIncentiveStatusCount: ', mktngPgmId);
    const include = [];

    if (distributionType === 'voucher') {
      include.push({
        as: 'voucher',
        model: Voucher,
        required: true,
      });
    }

    const where: Sequelize.WhereAttributeHash = {
      workFlowStatus: status,
      $and: Sequelize.literal(
        `("Incentive"."startDateTime", "Incentive"."endDateTime") OVERLAPS ('${startDateTime}','${endDateTime}')`,
      ),
      '$campaign.channels.marketingProgram.mktngPgmNbr$': mktngPgmId,
    };

    if (channelIds) {
      where['$campaign.channels.id$'] = {
        $in: channelIds.split(','),
      };
    }

    return Incentive.scope('includeEverything').count({
      include,
      where,
    });
  }

  /**
   * Get Distribution Status Details
   * @param mktngPgmId
   * @param startDateTime
   * @param endDateTime
   * @param distributionType
   * @param channelIds
   */
  async getDistributionStatusDetails(
    mktngPgmId: number,
    startDateTime: string,
    endDateTime: string,
    distributionType: string,
    channelIds?: string,
  ) {
    this.logger.info('BL Get Distribution Status Details: Started');
    let draftCount = 0;
    let publishCount = 0;
    let pauseCount = 0;
    let disabledCount = 0;
    let expiredCount = 0;
    let count = 0;
    const statusList = await this.getStatusList();

    await Promise.all(
      statusList.map(async statusId => {
        count = await this.getDistributionTypeStatusCount(
          mktngPgmId,
          startDateTime,
          endDateTime,
          statusId,
          distributionType,
          channelIds,
        );
        if (statusId === this.constants.statuses.DRAFT) {
          draftCount = count;
        } else if (statusId === this.constants.statuses.PUBLISHED) {
          publishCount = count;
        } else if (statusId === this.constants.statuses.UNPUBLISHED) {
          pauseCount = count;
        } else if (statusId === this.constants.statuses.EXPIRED) {
          expiredCount = count;
        } else {
          disabledCount = count;
        }
      }),
    );

    return {
      draft: draftCount,
      publish: publishCount,
      disable: disabledCount,
      expired: expiredCount,
    };
  }

  /**
   * Get Data
   * @param filters
   */
  async getData(filters: ReportFilters) {
    this.logger.info('CouponBl getData: ', filters);
    const {
      mktngPgmNbr,
      distributionType,
      startDateTime,
      endDateTime,
      channelIds,
      filterBy,
      groupByDate,
    } = filters;

    const dateColumn = filterBy ?? 'availedOn';
    console.log(groupByDate);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      attributes: groupByDate
        ? [
            [Sequelize.literal('COUNT(1)'), 'value'],
            [
              Sequelize.literal(`to_char("${dateColumn}", 'YYYY-MM-DD'::text)`),
              'date',
            ],
          ]
        : [],
      group: groupByDate ? ['date'] : '',
      where: {
        mktngPgmNbr,
        distributionType,
        channelId: channelIds
          ? {
              $in: channelIds.split(','),
            }
          : {
              $ne: null,
            },
        $and: [
          {
            [dateColumn]: {$gte: startDateTime},
          },
          {
            [dateColumn]: {$lte: endDateTime},
          },
        ],
      },
    };

    const results = groupByDate
      ? await Coupon.findAll(options)
      : await Coupon.count(options);

    return results;
  }

  /**
   * Get Total Cashback Paid
   * @param filters
   */
  async getTotalCashbackPaid(filters: ReportFilters) {
    this.logger.info('CouponBl getTotalCashbackPaid: ', filters);
    const {mktngPgmNbr, startDateTime, endDateTime, channelIds} = filters;

    const result = await Coupon.findAll({
      attributes: [
        'channelId',
        [Sequelize.fn(`sum`, Sequelize.col('incentiveValue')), 'amount'],
      ],
      group: ['channelId'],
      where: {
        mktngPgmNbr,
        distributionType: filters.distributionType,
        $and: [
          {
            redeemedOn: {$gte: startDateTime},
          },
          {
            redeemedOn: {$lte: endDateTime},
          },
        ],
        channelId: channelIds ? {$in: channelIds.split(',')} : {$ne: null},
      },
    });

    return result;
  }

  /**
   * Get Rsc Voucher Consumer CountData
   * @param filters
   */
  async getRscVoucherConsumerCountData(filters: ReportFilters) {
    this.logger.info('getRscVoucherConsumerCountData: ', filters);
    const {
      mktngPgmNbr,
      distributionType,
      startDateTime,
      endDateTime,
      channelIds,
      filterBy,
    } = filters;

    const dateColumn = filterBy ?? 'availedOn';

    const count = await Coupon.count({
      where: {
        mktngPgmNbr,
        distributionType,
        channelId: channelIds
          ? {
              $in: channelIds.split(','),
            }
          : {
              $ne: null,
            },
        $and: [
          {
            [dateColumn]: {$gte: startDateTime},
          },
          {
            [dateColumn]: {$lte: endDateTime},
          },
        ],
      },
      distinct: true,
      col: 'Coupon.consumerId',
    });

    return count;
  }

  /**
   * Get Retailer Count Data
   * @param filters
   * @returns
   */
  async getRetailerCountData(filters: ReportFilters) {
    this.logger.info('getRetailerCountData: ', filters);
    const {
      mktngPgmNbr,
      distributionType,
      startDateTime,
      endDateTime,
      channelIds,
      filterBy,
    } = filters;

    const dateColumn = filterBy ?? 'availedOn';

    const count = await Coupon.findAll({
      attributes: [[Sequelize.literal('COUNT(1)'), 'count'], 'retailer'],
      where: {
        mktngPgmNbr,
        distributionType,
        channelId: channelIds
          ? {
              $in: channelIds.split(','),
            }
          : {
              $ne: null,
            },
        $and: [
          {
            [dateColumn]: {$gte: startDateTime},
          },
          {
            [dateColumn]: {$lte: endDateTime},
          },
        ],
      },
      group: ['retailer'],
      order: [['count', 'DESC']],
      limit: 5,
    });

    return count;
  }

  /**
   * Get Rsc Voucher Data
   * @param filters
   */
  async getRscVoucherData(filters: ReportFilters) {
    this.logger.info('getRscVoucherData data: ', filters);
    let results = {};
    const [reservedCoupons, redeemedCoupons, totalCashbackPaid] =
      await Promise.all([
        this.getData(filters),
        this.getData({...filters, filterBy: 'redeemedOn'}),
        this.getTotalCashbackPaid(filters),
      ]);

    if (!filters.groupByDate) {
      const [reservedConsumnerCount, redeemedConsumnerCount, retailerDetails] =
        await Promise.all([
          this.getRscVoucherConsumerCountData(filters),
          this.getRscVoucherConsumerCountData({
            ...filters,
            filterBy: 'redeemedOn',
          }),
          this.getRetailerCountData(filters),
        ]);

      const retailers = retailerDetails || [];
      const couponLoadedByRetailers = retailers.reduce(
        (a: number, b: Coupon) =>
          a + +(b.toJSON() as unknown as {count: string}).count,
        0,
      );

      results = {
        reservedConsumners: reservedConsumnerCount || 0,
        redeemedConsumners: redeemedConsumnerCount || 0,
        retailers: [
          ...retailers,
          {
            count: (reservedCoupons - couponLoadedByRetailers).toString(),
            retailers: 'Others',
          },
        ],
      };
    }

    return {reservedCoupons, redeemedCoupons, totalCashbackPaid, ...results};
  }

  /**
   * Get Voucher Data
   * @param filters
   * @returns
   */
  async getVoucherData(filters: ReportFilters): Promise<VoucherResults> {
    const voucherData = await this.getRscVoucherData(filters);
    this.logger.info('getVoucherData data: ', voucherData);
    return voucherData;
  }
}
