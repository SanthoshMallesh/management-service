import {inject} from '@loopback/core';
import {api, get, param} from '@loopback/rest';
import * as winston from 'winston';
import {bindObjects} from '../application';
import {ReportBL} from '../BL';
import {IncentiveConstants} from '../constants-enum';

@api({
  basePath: '/v1/reports',
  paths: {},
})
export class ReportController {
  constructor(
    @bindObjects('reportBL', ReportBL)
    private reportBL: ReportBL,
    @inject('logger') private logger: winston.Logger,
  ) {}

  @get('/campaigns')
  async getCampaignStatusCount(
    @param.query.number('mktngPgmId') mktngPgmId: number,
    @param.query.string('startDateTime') startDateTime: string,
    @param.query.string('endDateTime') endDateTime: string,
    @param.query.string('channelIds') channelIds?: string,
  ) {
    this.logger.info('Get Campaign Status Count: Started');
    const statusType = 'campaign';
    const campaignStatusCount =
      await this.reportBL.getCampaignIncentiveStatusDetails(
        mktngPgmId,
        startDateTime,
        endDateTime,
        statusType,
        channelIds,
      );
    this.logger.info('Get Campaign Status Count: Completed');
    return campaignStatusCount;
  }

  @get('/incentives')
  async getIncentivesStatusCount(
    @param.query.number('mktngPgmId') mktngPgmId: number,
    @param.query.string('startDateTime') startDateTime: string,
    @param.query.string('endDateTime') endDateTime: string,
    @param.query.string('channelIds') channelIds?: string,
  ) {
    this.logger.info('Get Incentives Status Count: Started');
    const statusType = 'incentive';
    const campaignStatusCount =
      await this.reportBL.getCampaignIncentiveStatusDetails(
        mktngPgmId,
        startDateTime,
        endDateTime,
        statusType,
        channelIds,
      );
    this.logger.info('Get Incentives Status Count: Completed');
    return campaignStatusCount;
  }

  @get('/{distributionType}/distribution')
  async getDistributionStatusCount(
    @param.path.string('distributionType') distributionType: string,
    @param.query.number('mktngPgmId') mktngPgmId: number,
    @param.query.string('startDateTime') startDateTime: string,
    @param.query.string('endDateTime') endDateTime: string,
    @param.query.string('channelIds') channelIds?: string,
  ) {
    this.logger.info('Get Distribution Status Count: Started');
    const distributionTypeStatusCount =
      await this.reportBL.getDistributionStatusDetails(
        mktngPgmId,
        startDateTime,
        endDateTime,
        distributionType,
        channelIds,
      );
    this.logger.info('Get Distribution Status Count: Completed');
    return distributionTypeStatusCount;
  }

  @get('/{mktngPgmNbr}/{distributionType}')
  async get(
    @param.path.number('mktngPgmNbr') mktngPgmNbr: number,
    @param.path.string('distributionType') distributionType: string,
    @param.query.string('startDateTime') startDateTime: string,
    @param.query.string('endDateTime') endDateTime: string,
    @param.query.string('channelIds') channelIds?: string,
    @param.query.boolean('groupByDate') groupByDate?: boolean,
  ) {
    try {
      this.logger.info('Report controller get: Started');
      let result = {};

      const filters = {
        mktngPgmNbr,
        distributionType,
        startDateTime,
        endDateTime,
        channelIds,
        groupByDate,
      };

      switch (distributionType) {
        case IncentiveConstants.VOUCHER: {
          const voucherData = await this.reportBL.getVoucherData(filters);
          result = {...voucherData};
          break;
        }
      }
      return result;
    } catch (err) {
      this.logger.error('Report controller get: ', err);
      return err;
    }
  }
}
