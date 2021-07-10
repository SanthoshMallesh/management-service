import {
  Brand,
  Country,
  Currency,
  Locale,
  MarketingProgram,
  TimeZone,
} from '../models';

export function channelScopes() {
  return {
    includeEverything: {
      include: [
        {
          as: 'marketingProgram',
          attributes: ['id', 'mktngPrmNbr', 'mktngPrmName', 'mktngPgmDesc'],
          model: MarketingProgram,
          required: false,
          include: [
            {
              as: 'brand',
              attributes: ['id', 'name'],
              model: Brand,
              required: false,
            },
          ],
        },
        {
          as: 'country',
          model: Country,
          required: false,
          include: [
            {
              as: 'currency',
              attributes: ['id', 'name', 'code', 'symbol'],
              model: Currency,
              required: false,
            },
            {
              as: 'locale',
              attributes: ['id', 'name'],
              model: Locale,
              required: false,
            },
            {
              as: 'timeZone',
              model: TimeZone,
              required: false,
            },
          ],
        },
      ],
    },
  };
}
