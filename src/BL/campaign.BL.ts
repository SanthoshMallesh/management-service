import {inject} from '@loopback/core';
import * as winston from 'winston';
/* Model */
import {Campaign} from '../models';
/* Types */
import {CampaignRequestType} from '../types/campaign.type';

export class CampaignBL {
  constructor(@inject('logger') private logger: winston.Logger) {}

  async create(campaign: CampaignRequestType) {
    this.logger.info('Campaign BL - Campaign create ');
    const campaignInfo = await Campaign.findAll();
    return campaignInfo;
  }
}
