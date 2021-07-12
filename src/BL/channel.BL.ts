import {inject} from '@loopback/core';
import * as winston from 'winston';
/* application  */
import {bindObjects} from '../application';
import {APP_CONFIG_MODULES} from '../constants-enum';
import {AppConfigHelper} from '../helpers';
import {AppConfig, Channel, Locale} from '../models';
export class ChannelBL {
  constructor() {}

  @inject('logger') private logger: winston.Logger;

  @bindObjects('appConfigHelper', AppConfigHelper)
  private appConfigHelper: AppConfigHelper;
  // @inject('helper.appConfig') protected appConfigHelper: AppConfigHelper;

  /**
   * Process Channel
   *
   * @param channel
   * @param distributions
   */
  async processChannel(channel: Channel, distributions: string[] = []) {
    const {marketingProgram, id, country} = channel;
    const brand = marketingProgram.brand ? marketingProgram.brand : null;
    const currency = country.currency ? country.currency : null;
    const locale = country.locale ? country.locale : null;
    const timeZone = country.timeZone ? country.timeZone : null;

    const localeIds = await this.appConfigHelper.getModuleConfig(
      APP_CONFIG_MODULES.CHANNEL,
      id,
      'locale',
    );

    let locales: Array<{id: number; name: string}> = [];

    if (localeIds && localeIds.split(',').length > 0) {
      locales = await Locale.findAll({
        attributes: ['id', 'name'],
        where: {id: {$in: localeIds.split(',')}},
      });
    }

    return {
      id,
      name: channel.name,
      description: channel.description,
      marketingProgram: marketingProgram
        ? {
            id: marketingProgram.id,
            pgMpId: marketingProgram.mktngPrmNbr,
            name: marketingProgram.mktngPrmName,
            description: marketingProgram.mktngPgmDesc,
          }
        : null,
      brand,
      country: country
        ? {id: country.id, name: country.name, isoCode: country.isoCode}
        : null,
      currency,
      locales,
      timeZone,
      distributions,
    };
  }

  async getList() {
    this.logger.info('Channel List: Executing Query');

    const channels: Channel[] = await Channel.scope(
      'includeEverything',
    ).findAll({
      attributes: ['id', 'name', 'description'],
      where: {
        enabled: true,
        id: {$in: [2869]},
        '$marketingProgram.mktngPrmNbr$': {
          $in: [249],
        },
      },
    });

    const channelIds = channels.map(channel => channel.id);

    const appConfigs: AppConfig[] = await AppConfig.findAll({
      attributes: ['configValue', 'moduleId'],
      where: {
        module: 'Channel',
        configName: 'distributions',
        moduleId: {$in: [2869]},
      },
    });

    const distributions: {[channelId: number]: string[]} = {};

    for (const appConfig of appConfigs) {
      distributions[appConfig.moduleId] = (appConfig.configValue || '').split(
        ',',
      );
    }

    return (await Promise.all(
      channels.map(
        async (channel: Channel) =>
          (await this.processChannel(
            channel,
            distributions[channel.id],
          )) as unknown as Channel,
      ),
    )) as Channel[];
  }
}
