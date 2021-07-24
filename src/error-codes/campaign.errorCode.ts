import {DefaultErrorCode} from '.';

export class CampaignErrorCode extends DefaultErrorCode {
  static readonly errorMessages: {[index: string]: string} = {
    CHANNELS_REQUIRED: 'Channels is required',
    DESCRIPTION_REQUIRED: 'Description is required',
    INCENTIVE_COUNT_REQUIRED: 'Incentive required',
    CAMPAIGN_TYPE_REQUIRED: 'Campaign type required',
    BUDGET_AMOUNT_REQUIRED: 'Budget amount required',
    DRAFT_CAMPAIGNS_NOT_FOUND: 'Campaign %s should be in draft status',
    CAMPAIGNS_REQUIRED: 'Campaign is required',
    INVALID_SORT: 'Unable to sort campaign by %s',
    INVALID_SORT_DIRECTION: 'Invalid sort direction %s',
  };
}
