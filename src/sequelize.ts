import * as SequelizeModel from 'sequelize';
import {Sequelize, SequelizeOptions} from 'sequelize-typescript';
import {DB_CONFIG} from './config';
import {
  Campaign,
  CampaignChannel,
  Channel,
  District,
  Incentive,
  Locale,
  Voucher,
} from './models';

export default class SequelizeDB {
  static connect() {
    const {database, connectionString, ssl, logging} = DB_CONFIG;

    if (!database || !connectionString) {
      return '';
    }

    const options: SequelizeOptions = {
      dialect: 'postgres',
    };

    if (!logging) {
      options.logging = false;
    }

    const Op = SequelizeModel.Op;
    options.operatorsAliases = {
      $or: Op.or,
      $and: Op.and,
      $ne: Op.ne,
      $in: Op.in,
      $lte: Op.lte,
      $eq: Op.eq,
      $gte: Op.gte,
      $iLike: Op.iLike,
      $overlap: Op.overlap,
    };

    const sequelize = new Sequelize(
      `${connectionString}${database}${ssl ? '?ssl=true' : ''}`,
      options,
    );

    sequelize.addModels([
      Locale,
      District,
      Channel,
      Campaign,
      CampaignChannel,
      Incentive,
      Voucher,
    ]);

    return sequelize;
  }
}
