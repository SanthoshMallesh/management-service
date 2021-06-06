import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {Campaign} from '.';
import {Voucher} from './voucher.model';

@Table({
  tableName: 'incentive',
  timestamps: true,
})
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
