import {model, Model, property} from '@loopback/repository';

@model()
export class VoucherRequestType extends Model {
  @property({
    type: 'number',
  })
  minPurchasePrice: number;

  @property({
    type: 'Date',
    jsonSchema: {nullable: true},
  })
  fixedExpiryValue: Date | null;

  @property({
    type: 'number',
  })
  fileDistributionQuantity: number;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
  })
  voucherImage: string;

  constructor(data?: Partial<VoucherRequestType>) {
    super(data);
  }
}
