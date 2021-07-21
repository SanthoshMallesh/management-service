import {inject} from '@loopback/core';
import {api, get, param, Response, RestBindings} from '@loopback/rest';
import * as winston from 'winston';
/* Application */
import {bindObjects} from '../application';
/* BL */
import {ReportGenerationBL} from '../BL';
import moment = require('moment');

@api({
  basePath: '/v1/reports',
  paths: {},
})
export class ReportGenerationController {
  constructor(
    @bindObjects('reportGenerationBL', ReportGenerationBL)
    private reportGenerationBL: ReportGenerationBL,
  ) {}

  @inject('logger') private logger: winston.Logger;

  /**
   * Get Offer Performance Report Details
   *
   * @param channelId
   * @param date
   * @param response
   * @returns
   */
  @get('offer-performance/{channelId}/generate')
  async getOfferPerformanceReportDetails(
    @param.path.number('channelId') channelId: number,
    @param.query.date('date') date: Date,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    this.logger.info('Get Offer Performance Report Details: Started');
    const incentiveReport = await this.reportGenerationBL.get(
      channelId,
      moment(date).format('YYYY-MM-DD'),
    );

    response.setHeader(
      'Content-disposition',
      `attachemnt; filename=${incentiveReport?.fileName}`,
    );

    response.setHeader(
      'Content-Type',
      `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
    );

    response.send(incentiveReport?.reportBuffer);
  }
}
