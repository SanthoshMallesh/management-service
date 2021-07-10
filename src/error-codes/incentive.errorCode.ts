import {DefaultErrorCode} from '.';

export class IncentiveErrorCode extends DefaultErrorCode {
  static readonly errorMessages: {[index: string]: string} = {
    INCENTIVE_TYPE_REQUIRED: 'Incentive type is required',
    CAMPAIGN_REQUIRED: 'Campaign required',
    START_DATE_REQUIRED: 'Start date required',
    END_DATE_REQUIRED: 'End date required',
  };
}
