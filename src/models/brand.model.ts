import {
  Column,
  CreatedAt,
  Default,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'brand',
  timestamps: true,
})
export class Brand extends Model<Brand> {
  @Column
  name: string;

  @Column
  isMultiBrandType: boolean;

  @Default(true)
  @Column
  enabled: boolean;

  @Column
  createdBy: string;

  @CreatedAt
  createdDate: Date;

  @Column
  updatedBy: string;

  @UpdatedAt
  updatedDate: Date;
}
