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

  @get('/')
  async list(
    @param.query.number('page') page = 1,
    @param.query.number('limit') limit = 10,
    @param.query.string('sort') sort = 'updatedDate',
    @param.query.string('sortDir') sortDir = 'desc',
    @param.query.string('type') type: string,
    @param.query.number('status') status?: number,
    @param.query.string('search') search?: string,
    @param.query.object('filter') filter?: object,
  ): Promise<{
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    data: ResponseCampaign[];
  }> {
    return this.campaignBL.list({
      page,
      limit,
      sort,
      sortDir,
      type,
      status,
      search,
      filter,
    });
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
    await this.campaignBL.deleteCampaigns(campaignIds);
    return {message: 'Campaign deleted successfully'};
  }
}
