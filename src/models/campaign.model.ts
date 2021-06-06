import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'campaign',
  timestamps: true,
})
export class Campaign extends Model<Campaign> {
  @Column
  name: string;

  @Column
  description: string;

  @Column
  startDateTime: Date;

  @Column
  endDateTime: Date;

  @Column
  campaignType: string;

  @Column
  budgetAmount: number;

  @Column
  workFlowStatus: number;

  @Default(false)
  @Column
  isValid: boolean;

  @Column(DataType.JSON)
  errorDescription: JSON;

  @Column
  incentiveCount: number;

  @Column
  createdBy: string;

  @CreatedAt
  createdDate: Date;

  @Column
  updatedBy: string;

  @UpdatedAt
  updatedDate: Date;
}
