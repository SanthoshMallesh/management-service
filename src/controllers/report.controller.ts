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
