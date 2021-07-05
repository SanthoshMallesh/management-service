import {
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {Brand, Channel, Country} from '.';

@Table({
  tableName: 'marketing_program',
  timestamps: true,
})
export class MarketingProgram extends Model<MarketingProgram> {
  @Column
  mktngPrmNbr: number;

  @Column
  code: string;

  @Column
  mktngPrmName: string;

  @Column
  mktngPgmDesc: string;

  @Column
  legalEntNbr: number;

  @ForeignKey(() => Brand)
  @Column
  brandId: number;

  @ForeignKey(() => Country)
  @Column
  countryId: number;

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

  @HasMany(() => Channel)
  channels: Channel[];

  @BelongsTo(() => Brand)
  brand: Brand;

  @BelongsTo(() => Country)
  country: Country;
}
