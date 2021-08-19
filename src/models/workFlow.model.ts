import {
  Column,
  CreatedAt,
  Default,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'workFlow',
  timestamps: true,
})
export class WorkFlow extends Model<WorkFlow> {
  @Column
  status: string;

  @Column
  isCampaignFlow: boolean;

  @Column
  isIncentiveFlow: boolean;

  @Column
  isRequesterAction: boolean;

  @Column
  isApproverAction: boolean;

  @Column
  isWebStatus: boolean;

  @Default(true)
  @Column
  enabled: boolean;

  @Column
  updatedBy: string;

  @CreatedAt
  createdDate: Date;

  @UpdatedAt
  updatedDate: Date;

  @DeletedAt
  deletedDate: Date;
}
