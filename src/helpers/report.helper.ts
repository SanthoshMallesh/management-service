import {inject} from '@loopback/core';
import * as winston from 'winston';
import * as XLSX from 'xlsx';
import {LocaleHelper} from '.';
import {FormattedIncentive} from '../BL/reportGeneration.BL';
import {
  APP_CONFIG_MODULES,
  ReportingHeadersSorting,
  ReportingIncentiveHeaders,
  ReportingVoucherHeaders,
  ReportWorkBookDetails,
} from '../constants-enum';
import {
  AppConfig,
  Brand,
  Campaign,
  Channel,
  Country,
  Currency,
  Incentive,
  Locale,
  MarketingProgram,
  TimeZone,
  Voucher,
} from '../models';
import moment = require('moment-timezone');
import momentDate = require('moment');

export interface ProcessVoucher {
  id: number;
  minPurchasePrice: number | null;
}

export interface ProcessIncentive {
  id: number;
  startDateTime: Date;
  endDateTime: Date;
  name: string;
  voucher: ProcessVoucher;
}

export class ReportHelper {
  constructor() {}
  @inject('helper.locale')
  protected localeHelper: LocaleHelper;

  @inject('logger') private logger: winston.Logger;

  /**
   * Get Locales By ChannelId
   * @param channelId
   */
  async getLocalesByChannelId(channelId: number): Promise<Locale[]> {
    const appConfig = await AppConfig.findOne({
      attributes: ['configValue', 'configOptions'],
      where: {
        module: APP_CONFIG_MODULES.CHANNEL,
        moduleId: channelId,
        configName: 'locale',
      },
    });

    const localeIds = appConfig ? appConfig.configValue : null;

    let channelLocales =
      localeIds && localeIds.split(',').length > 0 ? localeIds.split(',') : [];

    if (channelLocales.length === 0) {
      const channel = await Channel.findOne({
        include: [
          {
            as: 'country',
            model: Country,
            required: true,
            include: [
              {
                as: 'locale',
                attributes: ['id', 'name'],
                model: Locale,
                required: true,
              },
            ],
          },
        ],
        where: {id: channelId},
      });

      const locale = channel.country.locale.id;

      channelLocales = [locale];
    }

    return Locale.findAll({
      attributes: ['name'],
      where: {id: {$in: channelLocales}},
    });
  }
  /**
   * Get Channel Details
   * @param channelId
   */
  async getChannelDetails(channelId: number) {
    const channel = await Channel.findOne({
      attributes: ['id', 'name'],
      include: [
        {
          as: 'marketingProgram',
          attributes: ['mktngPgmNbr', 'mktngPgmName'],
          model: MarketingProgram,
          required: true,
          include: [
            {
              as: 'brand',
              attributes: ['id', 'name'],
              model: Brand,
              where: {enabled: true},
              required: true,
            },
          ],
          where: {enabled: true},
        },
        {
          as: 'country',
          attributes: ['id', 'name'],
          model: Country,
          required: true,
          include: [
            {
              as: 'currency',
              attributes: ['name'],
              model: Currency,
              where: {enabled: true},
              required: true,
            },
            {
              as: 'timeZone',
              attributes: ['id', 'timeZone', 'timeZoneName'],
              model: TimeZone,
              where: {enabled: true},
              required: true,
            },
          ],
        },
      ],
      where: {id: channelId},
    });

    const locales = await this.getLocalesByChannelId(channelId);
    const localNames = locales.map(locale => locale.name);

    return {...channel.toJSON(), locales: localNames};
  }

  /**
   * Get Incentive By Channel
   * @param channelId
   * @param timeZone
   * @param date
   */
  async getIncentiveByChannel(
    channelId: number,
    timeZone: string,
    date: string,
  ) {
    const startDate = `${date} 00:00:00`;
    const endDate = `${date} 23:59:59`;

    const utcStartDate = moment.tz(startDate, timeZone).utc().format();
    const utcEndDate = moment.tz(endDate, timeZone).utc().format();

    const incentiveList = await Incentive.findAll({
      attributes: ['id', 'name', 'startDateTime', 'endDateTime'],
      include: [
        {
          as: 'campaign',
          attributes: ['id'],
          model: Campaign,
          required: true,
          include: [
            {
              as: 'channels',
              attributes: ['id'],
              model: Channel,
              required: true,
            },
          ],
        },
        {
          as: 'voucher',
          attributes: ['id', 'minPurchasePrice'],
          model: Voucher,
          required: false,
        },
      ],
      where: {
        '$campaign.channels.id$': channelId,
        startDateTime: {
          $lte: utcEndDate,
        },
        endDateTime: {
          $gte: utcStartDate,
        },
      },
    });

    return incentiveList;
  }

  /**
   * Get Headers
   * @param incentives
   * @param locales
   */
  getHeaders(incentives: Incentive[], locales: string[]): string[] {
    let reportingHeadersSortingList = [...ReportingHeadersSorting];

    const isVoucherExist = incentives.find(incentive => incentive.voucher);

    const headers: string[] = [
      ...Object.values(ReportingIncentiveHeaders),
      ...(isVoucherExist ? Object.values(ReportingVoucherHeaders) : []),
    ];

    return headers;
  }

  formatDate(date: Date, timeZone: string) {
    if (!date) {
      return '';
    }

    return moment.tz(date, timeZone).format('DD MMM,YYYY');
  }

  /**
   * Format Incentives
   * @param channel
   * @param incentives
   * @param locales
   * @param headers
   */
  formatIncentives(
    channel: Channel,
    incentives: Incentive[],
    locales: string[],
    headers: string[],
  ): FormattedIncentive[] {
    const formattedIncentives: FormattedIncentive[] = [];
    incentives.forEach(incentive => {
      const timeZone = channel.country.timeZone.timeZone;
      const formatedIncentive: FormattedIncentive = {
        [ReportingIncentiveHeaders.NAME]: incentive.name,
        [ReportingIncentiveHeaders.START_DATE_TIME]: this.formatDate(
          incentive.startDateTime,
          timeZone,
        ),
        [ReportingIncentiveHeaders.END_DATE_TIME]: this.formatDate(
          incentive.endDateTime,
          timeZone,
        ),
      };

      if (incentive.voucher) {
        this.logger.info(
          `formatedIncentive: id - ${incentive.id}, voucher id: ${incentive.voucher.id}`,
        );

        Object.assign(formatedIncentive, {
          [ReportingVoucherHeaders.MINIMUM_PURCHASE_PRISE]:
            incentive.voucher.minPurchasePrice,
        });

        this.logger.info(
          `voucher: formatedIncentive details - ${formatedIncentive}`,
        );
      }
      formattedIncentives.push(formatedIncentive);
    });

    return formattedIncentives;
  }

  /**
   * Get Buffer Date From Xlsx
   * @param formatedIncentives
   * @param headers
   * @param marketingProgram
   * @param date
   */
  public async getBufferDateFromXlsx(
    formatedIncentives: FormattedIncentive[],
    headers: string[],
    marketingProgram: MarketingProgram,
    date: string,
  ) {
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: ReportWorkBookDetails.TITLE,
      CreatedDate: new Date(),
    };

    const ws = XLSX.utils.json_to_sheet(
      [
        {
          Market: marketingProgram.mktngPgmName,
          Date: momentDate(date).format('DD MMM,YYYY'),
        },
      ],
      {
        header: ['Market', 'Date'],
        skipHeader: false,
      },
    );

    XLSX.utils.sheet_add_json(ws, formatedIncentives, {
      header: headers,
      skipHeader: false,
      origin: {r: 3, c: 0},
    });

    XLSX.utils.book_append_sheet(wb, ws, ReportWorkBookDetails.REPORTS);

    const reportBuffer = XLSX.write(wb, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    return reportBuffer;
  }
}
