import {
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {Country} from './country.model';

@Table({
  tableName: 'time_zone',
  timestamps: true,
})
export class TimeZone extends Model<TimeZone> {
  @Column
  timeZoneName: string;

  @ForeignKey(() => Country)
  @Column
  countryId: number;

  @Column
  gtmOffset: string;

  @Column
  timeZone: string;

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
