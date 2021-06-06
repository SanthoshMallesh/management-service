import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {Incentive} from '.';

@Table({
  tableName: 'voucher',
  timestamps: true,
})
export class Voucher extends Model<Voucher> {
  @ForeignKey(() => Incentive)
  @Column
  incentiveId: number;

  @Column
  minPurchasePrice: number;

  @Column
  fixedExpiryValue: Date;

  @Column
  fileDistributionQuantity: number;

  @Column
  fileUrl: string;

  @Column
  voucherImage: string;

  @Column
  createdBy: string;

  @CreatedAt
  createdDate: Date;

  @Column
  updatedBy: string;

  @UpdatedAt
  updatedDate: Date;

  @BelongsTo(() => Incentive)
  incentive: Incentive;
}
