import {Channel, TimeZone, WorkFlow} from '../models';

export function campaignScopes() {
  return {
    includeEverything: {
      include: [
        {
          as: 'channels',
          attributes: ['id', 'name'],
          model: Channel,
          required: false,
        },
        {
          as: 'requester',
          attributes: ['id', 'name'],
          model: WorkFlow,
          where: {enabled: true},
          required: false,
        },
        {
          as: 'approver',
          attributes: ['id', 'name'],
          model: WorkFlow,
          where: {enabled: true},
          required: false,
        },
        {
          as: 'status',
          attributes: ['id', 'name'],
          model: WorkFlow,
          where: {enabled: true},
          required: false,
        },
        {
          as: 'timeZone',
          attributes: ['id', 'timeZone', 'timeZoneName'],
          model: TimeZone,
          where: {enabled: true},
          required: false,
        },
      ],
    },
  };
}
