import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, Constructor, inject} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
/* Constant */
import {Constants} from './constants';
import {AppConfigHelper} from './helpers/appConfig.helper';
import {LocaleHelper} from './helpers/locale.helper';
import {ReportHelper} from './helpers/report.helper';
import sequelize from './sequelize';
import {MySequence} from './sequence';
import {CorrelationIdProvider} from './utils/correlationId-provider';
import {Logger} from './utils/logger';
export {ApplicationConfig};

let Global: ManagementServiceApplication;

export class ManagementServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    //Correlation Id Provider
    this.bind('provider.correlationId').toClass(CorrelationIdProvider);

    //Bind Constant
    this.bind('constants').toClass(Constants);

    //Logger
    Logger.initiateLogger();
    this.bind('logger').toClass(Logger);

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    this.bind('sequelize').to(sequelize.connect());

    Global = this;

    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    /**
     * Helpers
     */
    this.bind('helper.appConfig').to(AppConfigHelper);
    this.bind('helper.report').to(ReportHelper);
    this.bind('helper.locale').to(LocaleHelper);
  }
}

export function bindObjects(name: string, value: Constructor<unknown>) {
  try {
    if (Global) {
      Global.getBinding(name);
    }
  } catch {
    if (Global) {
      Global.bind(name).toClass(value);
    }
  }
  return inject(name);
}
