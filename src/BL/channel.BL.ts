import {inject} from '@loopback/core';
import * as winston from 'winston';
import {Channel} from '../models';

export class ChannelBL {
  constructor() {}

  @inject('logger') private logger: winston.Logger;

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

    console.log('channels : ', JSON.stringify(channels));

    return channels;
  }
}
