import {AppConfig} from '../models';

export class AppConfigHelper {
  /**
   * Get Module Config
   *
   * @param module
   * @param moduleId
   * @param configName
   * @param enabled
   */
  async getModuleConfig(
    module: string,
    moduleId: number,
    configName: string,
    enabled?: boolean,
  ) {
    const appConfig = await AppConfig.findOne({
      attributes: ['configValue', 'configOptions'],
      where: {
        module,
        moduleId,
        configName,
      },
    });

    return appConfig ? appConfig.configValue : null;
  }
}
