import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {FieldConfigPropertiesValidation} from '../types';

@Table({
  tableName: 'field_config',
  timestamps: true,
})
export class FieldConfig extends Model<FieldConfig> {
  @Column
  mpId: number;

  @Column
  area: string;

  @Column
  field: string;

  @Column(DataType.JSON)
  properties: FieldConfigPropertiesValidation;

  @Column
  multiLocale: string;

  @Column
  hidden: string;

  @Column
  enabled: string;

  @Column
  createdBy: string;

  @CreatedAt
  createdDate: Date;

  @Column
  updatedBy: string;

  @UpdatedAt
  updatedDate: Date;
}
