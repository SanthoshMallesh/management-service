import {
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {Campaign, Channel} from '.';

@Table({
  tableName: 'campaign_channel',
  timestamps: true,
})
export class CampaignChannel extends Model<CampaignChannel> {
  @ForeignKey(() => Campaign)
  @Column
  campaignId: number;

  @ForeignKey(() => Channel)
  @Column
  channelId: number;

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

  @BelongsTo(() => Channel)
  channel: Channel;
}
