import {inject, Provider} from '@loopback/context';
import {Request, RestBindings} from '@loopback/rest';
//const uuidv4 = require('uuid');
import {v4 as uuidv4} from 'uuid';

export class CorrelationIdProvider implements Provider<string | string[]> {
  constructor(@inject(RestBindings.Http.REQUEST) private request: Request) {}

  value() {
    return (
      this.request.headers['x-correlation-id'] ??
      (this.request.headers['x-correlation-id'] = uuidv4())
    );
  }
}
