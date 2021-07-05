import {
  Column,
  CreatedAt,
  Default,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'currency',
  timestamps: true,
})
export class Currency extends Model<Currency> {
  @Column
  name: string;

  @Column
  code: string;

  @Column
  symbol: string;

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
