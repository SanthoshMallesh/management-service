import {
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import {Country, MarketingProgram} from '.';

@Table({
  tableName: 'channel',
  timestamps: true,
})
export class Channel extends Model<Channel> {
  @Column
  name: string;

  @ForeignKey(() => MarketingProgram)
  @Column
  mktngPgmId: number;

  @ForeignKey(() => Country)
  @Column
  countryId: number;

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

  @BelongsTo(() => MarketingProgram)
  marketingProgram: MarketingProgram;

  @BelongsTo(() => Country)
  country: Country;
}
