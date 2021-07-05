import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {CampaignChannel, Channel, Incentive, TimeZone} from '.';
import {campaignScopes} from '../scopes';

@Table({
  tableName: 'campaign',
  timestamps: true,
})
@Scopes(campaignScopes)
export class Campaign extends Model<Campaign> {
  @Column
  name: string;

  @Column
  description: string;

  @Column
  startDateTime: Date;

  @Column
  endDateTime: Date;

  @Column
  campaignType: string;

  @Column
  budgetAmount: number;

  @Column
  workFlowStatus: number;

  @Default(false)
  @Column
  isValid: boolean;

  @Column(DataType.JSON)
  errorDescription: JSON;

  @Column
  incentiveCount: number;

  @ForeignKey(() => TimeZone)
  @Column
  timeZoneId: number;

  @Column
  createdBy: string;

  @CreatedAt
  createdDate: Date;

  @Column
  updatedBy: string;

  @UpdatedAt
  updatedDate: Date;

  @HasMany(() => Incentive)
  incentives?: Incentive[];

  @HasMany(() => CampaignChannel)
  campaignChannels?: CampaignChannel[];

  @BelongsTo(() => CampaignChannel, 'id')
  campaignChannel: CampaignChannel;

  @BelongsToMany(() => Channel, () => CampaignChannel)
  channels: Channel[];

  @BelongsTo(() => TimeZone)
  timeZone: TimeZone;
}
