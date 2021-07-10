/* error-codes */
import {CampaignErrorCode} from '../error-codes/campaign.errorCode';
/* models */
import {Campaign, Channel, Incentive} from '../models';

export class CampaignHelper {
  private requiredValidationErrors: {[index: string]: string} = {};

  /**
   * Required Validation Error
   *
   * @param key
   * @param errorCode
   * @param parameters
   */
  requiredValidationError(
    key: string,
    errorCode: string,
    parameters: string[] | number[] = [],
  ) {
    this.requiredValidationErrors = CampaignErrorCode.getErrors(
      this.requiredValidationErrors,
      key,
      errorCode,
      parameters,
    );
  }

  /**
   *Validate For Publish
   * @param campaignId
   */
  async validateForPublish(campaignId: number) {
    const campaign = await Campaign.findOne({
      where: {id: campaignId},
      attributes: [
        'description',
        'incentiveCount',
        'campaignType',
        'budgetAmount',
      ],
      include: [
        {
          as: 'channels',
          attributes: ['id'],
          model: Channel,
          required: true,
        },
      ],
    });

    const {description, incentiveCount, campaignType, budgetAmount} = campaign;
    //const {description} = campaign;

    if (!description) {
      this.requiredValidationError('description', 'DESCRIPTION_REQUIRED');
    }

    if (!incentiveCount) {
      this.requiredValidationError(
        'incentiveCount',
        'INCENTIVE_COUNT_REQUIRED',
      );
    }

    if (!campaignType) {
      this.requiredValidationError('campaignType', 'CAMPAIGN_TYPE_REQUIRED');
    }

    if (!budgetAmount) {
      this.requiredValidationError('budgetAmount', 'BUDGET_AMOUNT_REQUIRED');
    }

    await Campaign.update(
      {
        isValid: Object.keys(this.requiredValidationErrors).length === 0,
        errorDescription:
          Object.keys(this.requiredValidationErrors).length > 0
            ? this.requiredValidationErrors
            : null,
      },
      {
        where: {
          id: campaignId,
        },
      },
    );
  }

  /**
   * Update Incentives Count
   *
   * @param campaignId
   */
  async updateIncentivesCount(campaignId: number) {
    const incentiveCount = await Incentive.count({
      where: {campaignId},
    });

    const updateCampaign = await Campaign.update(
      {incentiveCount},
      {where: {id: campaignId}},
    );

    await this.validateForPublish(campaignId);
    return updateCampaign;
  }
}
