import {inject} from '@loopback/core';
import {
  api,
  del,
  get,
  param,
  post,
  put,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
/* Application */
import {bindObjects} from '../application';
/* Business Logic */
import {CampaignBL, ResponseCampaign} from '../BL';
/* models */
import {Campaign} from '../models';
/* Types */
import {CampaignDeleteRequestType, CampaignRequestType} from '../types';

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

  @put('/{id}')
  async update(
    @param.path.number('id') id: number,
    @requestBody() campaign: CampaignRequestType,
  ): Promise<{message: string; campaignId: number; data: Campaign}> {
    const updateCampaignId = await this.campaignBL.update(id, campaign);
    await this.campaignBL.validateForPublish(id);
    const campaignDetails = await this.campaignBL.get(updateCampaignId);

    if (this.res) {
      this.res.status(201);
    }
    return {
      message: 'Campaign updated successfully',
      campaignId: updateCampaignId,
      data: campaignDetails,
    };
  }

  @get('/{id}')
  async get(@param.path.number('id') id: number): Promise<ResponseCampaign> {
    const campaign = await this.campaignBL.get(id);
    return CampaignBL.processCampaign(campaign);
  }

  @del('/')
  async delCampaign(
    @requestBody() campaign: CampaignDeleteRequestType,
  ): Promise<{message: string}> {
    const campaignIds = Array.from(new Set(campaign.ids));
    const campaign1 = await this.campaignBL.deleteCampaigns(campaignIds);
    return {message: 'Campaign deleted successfully'};
  }
}
