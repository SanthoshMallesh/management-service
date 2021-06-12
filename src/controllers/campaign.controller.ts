import {inject} from '@loopback/core';
import {api, post, requestBody, Response, RestBindings} from '@loopback/rest';
/* Application */
import {bindObjects} from '../application';
/* Business Logic */
import {CampaignBL} from '../BL';
/* models */
import {Campaign} from '../models';
/* Types */
import {CampaignRequestType} from '../types';

@api({
  basePath: '/v1/campaign',
  paths: {},
})
export class CampaignController {
  constructor(
    @bindObjects('campaignBL', CampaignBL)
    private campaignBL: CampaignBL,
    @inject(RestBindings.Http.RESPONSE) private res?: Response,
  ) {}

  @post('/')
  async create(
    @requestBody() campaign: CampaignRequestType,
  ): Promise<{message: string; campaignId: number; data: Campaign}> {
    const createCampaignId = await this.campaignBL.create(campaign);
    await this.campaignBL.validateForPublish(createCampaignId);
    const campaignDetails = await this.campaignBL.get(createCampaignId);

    if (this.res) {
      this.res.status(201);
    }
    return {
      message: 'Campaign created successfully',
      campaignId: createCampaignId,
      data: campaignDetails,
    };
  }
}
