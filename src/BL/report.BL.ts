import {inject} from '@loopback/core';
import * as winston from 'winston';
import {Coupon} from '../models/coupon.model';
const {Sequelize} = require('sequelize');

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
  constructor() {}

  @inject('logger') private logger: winston.Logger;

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
