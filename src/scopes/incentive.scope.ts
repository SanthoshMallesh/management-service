import {Campaign, Channel, MarketingProgram, Voucher} from '../models';

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

    includeMarketingProgram: {
      include: [
        {
          as: 'campaign',
          attributes: ['id'],
          model: Campaign,
          include: [
            {
              as: 'channels',
              attributes: ['id'],
              model: Channel,
              required: true,
              include: [
                {
                  as: 'marketingProgram',
                  attributes: [
                    'id',
                    'mktngPgmNbr',
                    'mktngPgmName',
                    'mktngPgmDesc',
                  ],
                  model: MarketingProgram,
                  required: true,
                  where: {enabled: true},
                },
              ],
              where: {enabled: true},
            },
          ],
          require: true,
        },
      ],
    },
  };
}
