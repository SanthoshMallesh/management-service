import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import {Currency, Locale} from '.';
import {TimeZone} from './timeZone.model';

@Table({
  tableName: 'country',
  timestamps: true,
})
export class Country extends Model<Country> {
  @Column
  name: string;

  @Column
  isoCode: string;

  @ForeignKey(() => Locale)
  @Column
  localeId: number;

  @ForeignKey(() => Currency)
  @Column
  primaryCurrencyId: number;

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

  @BelongsTo(() => Currency)
  currency: Currency;

  @HasOne(() => TimeZone)
  timeZone: TimeZone;
}
