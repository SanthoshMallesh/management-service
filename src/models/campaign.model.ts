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
import {WorkFlow} from './workFlow.model';

@Table({
  tableName: 'campaign',
  timestamps: true,
})
@Scopes(campaignScopes)
export class Campaign extends Model<Campaign> {
  @ForeignKey(() => Campaign)
  @Column
  parentCampaignId: number;

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
  budgetCode: string;

  @Column
  consumerParticipationLimit: number;

  @Column
  campaignrParticipationLimit: number;

  @Column
  campaignImage: string;

  @ForeignKey(() => WorkFlow)
  @Column
  requesterAction: number;

  @ForeignKey(() => WorkFlow)
  @Column
  approverAction: number;

  @ForeignKey(() => WorkFlow)
  @Column
  webStatus: number;

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

  @BelongsTo(() => WorkFlow, 'requesterAction')
  requester: WorkFlow;

  @BelongsTo(() => WorkFlow, 'approverAction')
  approver: WorkFlow;

  @BelongsTo(() => WorkFlow, 'webStatus')
  status: WorkFlow;

  @BelongsTo(() => WorkFlow, 'webStatus')
  workFlowStatus: WorkFlow;

  @BelongsTo(() => CampaignChannel, 'id')
  campaignChannel: CampaignChannel;

  @BelongsToMany(() => Channel, () => CampaignChannel)
  channels: Channel[];

  @BelongsTo(() => TimeZone)
  timeZone: TimeZone;
}
