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
