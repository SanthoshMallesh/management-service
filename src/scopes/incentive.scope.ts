import {Campaign, Channel, Voucher} from '../models';

export function incentiveScopes() {
  return {
    includeEverything: {
      include: [
        {
          as: 'campaign',
          attributes: ['id'],
          model: Campaign,
          required: false,
          include: [
            {
              as: 'channels',
              attributes: ['id', 'name'],
              model: Channel.scope('includeEverything'),
              required: false,
            },
          ],
        },
        {
          as: 'voucher',
          model: Voucher,
          required: false,
        },
      ],
    },
  };
}
