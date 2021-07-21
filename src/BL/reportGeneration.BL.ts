import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import * as winston from 'winston';
/* application  */
import {bindObjects} from '../application';
import {ReportHelper} from '../helpers';

import moment = require('moment');

export interface FormattedIncentive {
  [key: string]: string | number;
}

export class ReportGenerationBL {
  constructor() {}

  @inject('logger') private logger: winston.Logger;

  @bindObjects('reportHelper', ReportHelper)
  private reportHelper: ReportHelper;

  /**
   * Get
   * @param channelId
   * @param date
   */
  async get(channelId: number, date: string) {
    this.logger.info('Channel List: Executing Query');
    const channel = await this.reportHelper.getChannelDetails(channelId);
    if (!channel) {
      this.logger.error(
        `ReportGenerationBL: channelId - ${channelId}, channel not found`,
      );
      return;
    }

    const incentives = await this.reportHelper.getIncentiveByChannel(
      channel.id,
      channel.country.timeZone.timeZone,
      date,
    );

    if (incentives.length === 0) {
      this.logger.error(
        `ReportGenerationBL: channelId - ${channelId}, incentive not found`,
      );
      throw new HttpErrors.BadRequest(`Incentive not found`);
    }

    const {locales} = channel;
    const headers = this.reportHelper.getHeaders(incentives, locales);
    const formatedIncentives = this.reportHelper.formatIncentives(
      channel,
      incentives,
      locales,
      headers,
    );

    const reportBuffer = await this.reportHelper.getBufferDateFromXlsx(
      formatedIncentives,
      headers,
      channel.marketingProgram,
      date,
    );

    const fileName = `Report_${
      channel.marketingProgram.mktngPrmNbr
    }_Incentives_${moment(date).format('MM_DD_YYYY')}.xlsx`;

    return {fileName, reportBuffer};
  }
}
