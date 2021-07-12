import {api, get} from '@loopback/rest';
/* Application */
import {bindObjects} from '../application';
/* BL */
import {ChannelBL} from '../BL';
import {Channel} from '../models';

@api({
  basePath: '/v1/channels',
  paths: {},
})
export class ChannelController {
  constructor(
    @bindObjects('channelBL', ChannelBL)
    private channelBL: ChannelBL,
  ) {}

  /**
   *Get Channel List
   */
  @get('/')
  async list(): Promise<Channel[]> {
    return this.channelBL.getList();
  }
}
