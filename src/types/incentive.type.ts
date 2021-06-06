import {model, Model, property} from '@loopback/repository';
import {VoucherRequestType} from './voucher.type';

@model()
export class IncenitveRequestType extends Model {
  @property({
    type: 'number',
    required: true,
  })
  campaignId: number;

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
    type: 'Date',
  })
  startDateTime: Date;

  @property({
    type: 'Date',
  })
  endDateTime: Date;

  @property({
    type: 'string',
  })
  incentiveType?: string;

  @property({
    type: 'number',
  })
  workFlowStatus: number;

  @property({
    jsonSchema: {nullable: true},
  })
  voucher?: VoucherRequestType;

  constructor(data?: Partial<IncenitveRequestType>) {
    super(data);
  }
}
