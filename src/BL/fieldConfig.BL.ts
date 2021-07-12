import {inject} from '@loopback/core';
import * as winston from 'winston';
/* models */
import {FieldConfig} from '../models';

export class FieldConfigBL {
  constructor() {}

  @inject('logger') private logger: winston.Logger;

  async getList(): Promise<FieldConfig[]> {
    this.logger.info('FieldConfig List: Executing Query');

    return await FieldConfig.findAll({
      attributes: [
        'id',
        'mpId',
        'area',
        'field',
        'properties',
        'multiLocale',
        'hidden',
      ],
      where: {
        enabled: true,
        mpId: {$in: [20]},
      },
    });
  }
}
