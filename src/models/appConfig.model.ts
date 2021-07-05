import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'app_config',
  timestamps: true,
})
export class AppConfig extends Model<AppConfig> {
  @Column
  module: string;

  @Column
  moduleId: number;

  @Column
  configName: string;

  @Column
  configValue: string;

  @Column(DataType.JSON)
  configOptions: JSON;

  @Column
  createdBy: string;

  @CreatedAt
  createdDate: Date;

  @Column
  updatedBy: string;

  @UpdatedAt
  updatedDate: Date;
}
