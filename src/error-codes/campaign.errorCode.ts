import {DefaultErrorCode} from '.';

export class CampaignErrorCode extends DefaultErrorCode {
  static readonly errorMessages: {[index: string]: string} = {
    CHANNELS_REQUIRED: 'Channels is required',
    DESCRIPTION_REQUIRED: 'Description is required',
    INCENTIVE_COUNT_REQUIRED: 'Incentive required',
    CAMPAIGN_TYPE_REQUIRED: 'Campaign type required',
    BUDGET_AMOUNT_REQUIRED: 'Budget amount required',
    CAMPAIGN_NOT_FOUND: 'Campaign %d not found',
  };
}
