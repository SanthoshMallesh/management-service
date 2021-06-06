import {model, Model, property} from '@loopback/repository';

@model()
export class CampaignRequestType extends Model {
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
    type: 'number',
  })
  workFlowStatus: number;

  constructor(data?: Partial<CampaignRequestType>) {
    super(data);
  }
}
