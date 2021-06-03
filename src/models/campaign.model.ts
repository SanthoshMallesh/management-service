import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'campaign',
  timestamps: true,
  paranoid: true,
})
export class Campaign extends Model<Campaign> {
  @Column
  name: string;

  @Column
  updatedBy: string;

  @CreatedAt
  createdDate: Date;

  @UpdatedAt
  updatedDate: Date;

  @DeletedAt
  deletedDate: Date;
}
