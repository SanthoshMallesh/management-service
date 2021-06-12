import {Channel} from '../models';

export function campaignScopes() {
  return {
    includeEverything: {
      include: [
        {
          as: 'channels',
          attributes: ['id', 'name'],
          model: Channel,
          required: true,
        },
      ],
    },
  };
}
