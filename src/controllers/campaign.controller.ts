import {api, post, requestBody} from '@loopback/rest';
/* Application */
import {bindObjects} from '../application';
/* Business Logic */
import {CampaignBL} from '../BL';
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
  ) {}

  @post('/')
  async create(@requestBody() campaign: CampaignRequestType) {
    const createCampaign = await this.campaignBL.create(campaign);
    return createCampaign;
  }
}
