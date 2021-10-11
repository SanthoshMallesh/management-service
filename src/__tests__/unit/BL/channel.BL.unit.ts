import {
  createStubInstance,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import * as winston from 'winston';
import {ChannelBL} from '../../../BL/channel.BL';
import {AppConfigHelper} from '../../../helpers';
import {Logger} from '../../../utils/logger';

describe('Channel BL', () => {
  let channelBL: ChannelBL;
  let logger: winston.Logger;
  let appConfigHelper: StubbedInstanceWithSinonAccessor<AppConfigHelper>;

  beforeEach(() => {
    Logger.initiateLogger();
    logger = Logger.logger;
    appConfigHelper = createStubInstance(AppConfigHelper);
    sinon.stub(logger, 'info').resolves(null);
    channelBL = new ChannelBL();
    channelBL.logger = logger;
    channelBL['appConfigHelper'] = appConfigHelper;
  });

  afterEach(() => {
    sinon.restore();
  });

  // it('process channel', async () => {
  //   const sampleChannelResponse = {
  //     id: 2869,
  //     name: 'GF PL Website',
  //     description: null,
  //     marketingProgram: {
  //       id: 20,
  //       mktngPgmNbr: 249,
  //       mktngPgmName: 'Growing Families PL',
  //       mktngPgmDesc: null,
  //       brand: {id: 1, name: 'Growing Families'},
  //     },
  //     country: {
  //       id: 20,
  //       name: 'Poland',
  //       isoCode: 'PL',
  //       localeId: 19,
  //       primaryCurrencyId: 7,
  //       createdBy: 'admin',
  //       updatedBy: 'admin',
  //       createdDate: new Date('2021-07-06T07:38:09.661Z'),
  //       updatedDate: new Date('2021-07-06T07:38:09.661Z'),
  //       currency: {
  //         id: 7,
  //         name: 'Polish zloty',
  //         code: 'PLN',
  //         symbol: '&#122;&#322;',
  //       },
  //       locale: {id: 19, name: 'pl-PL'},
  //       timeZone: {
  //         id: 2,
  //         timeZoneName: 'CEST',
  //         countryId: 20,
  //         gtmOffset: '',
  //         timeZone: 'Europe/Warsaw',
  //         enabled: true,
  //         createdBy: 'admin',
  //         updatedBy: 'admin',
  //         createdDate: new Date('2021-07-19T16:57:20.933Z'),
  //         updatedDate: new Date('2021-07-19T16:57:20.933Z'),
  //       },
  //     },
  //   };

  //   const result = await channelBL.processChannel(sampleChannelResponse);
  //   sinon.assert.match(result, sampleChannelDetails);
  // });
});
