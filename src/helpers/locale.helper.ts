import {inject} from '@loopback/core';
import {APP_CONFIG_MODULES} from '../constants-enum';
import {Channel, Country, Locale} from '../models';
import {AppConfigHelper} from './appConfig.helper';

export class LocaleHelper {
  @inject('helper.appConfig')
  private appConfigHelper: AppConfigHelper;

  /**
   * Get Locales By ChannelId
   * @param channelId
   */
  async getLocalesByChannelId(channelId: number): Promise<Locale[]> {
    const localeIds = await this.appConfigHelper.getModuleConfig(
      APP_CONFIG_MODULES.CHANNEL,
      channelId,
      'locale',
      true,
    );

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
}
