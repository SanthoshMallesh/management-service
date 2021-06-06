import {
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import {District} from '.';

@Table({
  tableName: 'channel',
  timestamps: true,
})
export class Channel extends Model<Channel> {
  @Column
  name: string;

  @ForeignKey(() => District)
  @Column
  districtId: number;

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

  @BelongsTo(() => District)
  district: District;
}
