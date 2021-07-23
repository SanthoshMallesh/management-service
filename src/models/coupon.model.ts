import {Column, Model, Table} from 'sequelize-typescript';

@Table({
  tableName: 'coupon',
  timestamps: false,
})
export class Coupon extends Model<Coupon> {
  @Column
  consumerId: string;

  @Column({
    unique: true,
  })
  consumerIncentiveId: string;

  @Column
  incentiveId: number;

  @Column
  channelId: number;

  @Column
  mktngPgmNbr: number;

  @Column
  availedOn: Date;

  @Column
  redeemedOn: Date;

  @Column
  distributionType: string;

  @Column
  retailer: string;

  @Column
  incentiveValue: number;

  @Column
  incentiveValueType: string;

  @Column
  expiryDate: Date;
}
