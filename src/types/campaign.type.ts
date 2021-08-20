import {model, Model, property} from '@loopback/repository';

@model()
export class CampaignDeleteRequestType extends Model {
  @property.array(Number)
  ids?: number[];
}
@model()
export class CampaignRequestType extends Model {
  @property({
    type: 'number',
  })
  parentCampaignId: number;

  @property.array(Number)
  channels: number[];

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
  })
  campaignType: string;

  @property({
    type: 'Date',
  })
  startDateTime: Date;

  @property({
    type: 'Date',
  })
  endDateTime: Date;

  @property({
    type: 'number',
  })
  budgetAmount: number;

  @property({
    type: 'string',
  })
  budgetCode?: string;

  @property({
    type: 'number',
  })
  requesterAction?: number;

  @property({
    type: 'number',
  })
  approverAction?: number;

  @property({
    type: 'number',
  })
  webStatus?: number;

  @property({
    type: 'number',
  })
  workFlowStatus?: number;

  @property({
    type: 'number',
  })
  timeZoneId?: number;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
  })
  campaignImage?: string;

  @property({
    type: 'number',
    jsonSchema: {nullable: true},
  })
  consumerParticipationLimit?: number | null;

  @property({
    type: 'number',
    jsonSchema: {nullable: true},
  })
  campaignParticipationLimit?: number | null;

  constructor(data?: Partial<CampaignRequestType>) {
    super(data);
  }
}
