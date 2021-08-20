import {inject} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {CorrelationIdProvider} from './utils/correlationId-provider';
import {Logger} from './utils/logger';

const SequenceActions = RestBindings.SequenceActions;
export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject('provider.correlationId')
    protected correlationIdProvider: CorrelationIdProvider,
    @inject('logger') private logger: Logger,
  ) {}

  async handle(context: RequestContext) {
    const {response} = context;
    try {
      const {request} = context;
      response.header('Access-Control-Allow-Origin', '*');
      response.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
      );
      response.header('Access-Control-Allow-Methods', '*');
      const correlationId = await this.correlationIdProvider.value();
      this.logger.setCorrelationId(correlationId as string);
      if (request.method == 'OPTIONS') {
        response.status(200);
        this.send(response, 'ok');
      } else {
        const route = this.findRoute(request);
        const args = await this.parseParams(request, route);
        const result = await this.invoke(route, args);
        this.send(response, result);
      }
    } catch (err) {
      if (err.errors) {
        response.status(err.status);
        this.send(response, {errors: err.errors});
      } else {
        this.reject(context, err);
      }
    }
  }
}
