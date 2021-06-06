import {Column, CreatedAt, Default, Model, Table} from 'sequelize-typescript';

@Table({
  tableName: 'locale',
  timestamps: true,
})
export class Locale extends Model<Locale> {
  @Column
  name: string;

  @Column
  description: string;

  @Default(true)
  @Column
  enabled: boolean;

  @Column
  createdBy: string;

  @CreatedAt
  createdDate: Date;

  @Column
  updatedBy: string;

  @CreatedAt
  updatedDate: Date;
}
