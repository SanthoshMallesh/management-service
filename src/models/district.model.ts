import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import {Locale} from '.';

@Table({
  tableName: 'district',
  timestamps: true,
})
export class District extends Model<District> {
  @Column
  name: string;

  @ForeignKey(() => Locale)
  @Column
  localeId: number;

  @Column
  createdBy: string;

  @CreatedAt
  createdDate: Date;

  @Column
  updatedBy: string;

  @CreatedAt
  updatedDate: Date;

  @BelongsTo(() => Locale)
  locale: Locale;
}
