import {api, get} from '@loopback/rest';
import {Campaign} from '../models';
@api({
  basePath: '/v1/campaign',
  paths: {},
})
export class CampaignController {
  constructor() {}

  @get('/')
  async list() {
    const campaign = await Campaign.findOne();
    return campaign;
  }
}
