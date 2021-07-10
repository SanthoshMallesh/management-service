import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {Campaign, Voucher} from '.';
import {incentiveScopes} from '../scopes';
@Table({
  tableName: 'incentive',
  timestamps: true,
})
@Scopes(incentiveScopes)
export class Incentive extends Model<Incentive> {
  @ForeignKey(() => Campaign)
  @Column
  campaignId: number;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  startDateTime: Date;

  @Column
  endDateTime: Date;

  @Column
  incentiveType: string;

  @Column
  workFlowStatus: number;

  @Column
  distributionType: string;

  @Default(false)
  @Column
  isValid: boolean;

  @Column(DataType.JSON)
  errorDescription: JSON;

  @Column
  createdBy: string;

  @CreatedAt
  createdDate: Date;

  @Column
  updatedBy: string;

  @UpdatedAt
  updatedDate: Date;

  @BelongsTo(() => Campaign)
  campaign: Campaign;

  @HasOne(() => Voucher)
  voucher: Voucher;
}
