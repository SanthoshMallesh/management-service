import {inject} from '@loopback/core';
import {api, post, requestBody, Response, RestBindings} from '@loopback/rest';
import * as winston from 'winston';
/* Application */
import {bindObjects} from '../application';
/* Business Logic */
import {CampaignBL, IncentiveBL} from '../BL';
import {Campaign, Incentive} from '../models';
/* Types */
import {IncenitveRequestType} from '../types';

@api({
  basePath: '/v1/incentive',
  paths: {},
})
export class IncentiveController {
  constructor(
    @bindObjects('incentiveBL', IncentiveBL)
    private incentiveBL: IncentiveBL,
    @bindObjects('campaignBL', CampaignBL)
    private campaignBL: CampaignBL,
    @inject(RestBindings.Http.RESPONSE) private res?: Response,
  ) {}

  @inject('logger') private logger: winston.Logger;

  @post('/')
  async create(@requestBody() incentive: IncenitveRequestType): Promise<{
    message: string;
    incentiveId: number;
    data: Incentive;
    campaign: Campaign;
  }> {
    const createdIncentive = await this.incentiveBL.create(incentive);
    const incentiveDetails = await this.incentiveBL.get(createdIncentive);
    const campaignDetails = await this.campaignBL.get(
      incentiveDetails.campaignId,
    );

    if (this.res) {
      this.res.status(201);
    }
    return {
      message: 'Incentive created successfully',
      incentiveId: createdIncentive,
      data: incentiveDetails,
      campaign: campaignDetails,
    };
  }
}
