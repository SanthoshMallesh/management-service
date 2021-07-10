import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {Campaign, CampaignChannel, Country, MarketingProgram} from '.';
import {channelScopes} from '../scopes';

@Table({
  tableName: 'channel',
  timestamps: true,
})
@Scopes(channelScopes)
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

  @UpdatedAt
  updatedDate: Date;

  @BelongsTo(() => MarketingProgram)
  marketingProgram: MarketingProgram;

  @BelongsToMany(() => Campaign, () => CampaignChannel)
  campaign: CampaignChannel[];

  @BelongsTo(() => Country)
  country: Country;
}
