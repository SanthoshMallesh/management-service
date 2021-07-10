import {HttpErrors} from '@loopback/rest';
import {vsprintf} from 'sprintf-js';

export class DefaultErrorCode {
  static readonly errorMessages: {[index: string]: string} = {
    NAME_REQUIRED: 'Name is Required',
    START_DATE_REQUIRED: 'Start date is required',
    END_DATE_REQUIRED: 'End date is required',
    UPDATE_EXPIRED_CAMPAIGN: 'Campaign %d can not be updated in %s state',
    CAMPAIGN_NOT_FOUND: 'Campaign %d not found',
    INCENTIVE_NOT_FOUND: 'Incentive %d not found',
  };

  static readonly errorCodes: {[index: string]: number} = {};

  /**
   * Errror
   *
   * @param errorCode
   * @param parameters
   * @returns
   */
  static error(
    errorCode: string,
    parameters: (string | number)[] = [],
  ): HttpErrors.HttpError {
    const errorMessage =
      this.errorMessages[errorCode] ||
      DefaultErrorCode.errorMessages[errorCode];

    if (!errorMessage) {
      return new HttpErrors.BadGateway(errorCode);
    }

    const statusCode =
      this.errorCodes[errorCode] || DefaultErrorCode.errorMessages[errorCode];

    return HttpErrors(statusCode || 422, vsprintf(errorMessage, parameters));
  }

  /**
   * Throw Error Message
   *
   * @param errorCode
   * @param parameters
   * @returns
   */
  static throwErrorMessage(
    errorCode: string,
    parameters: (string | number)[] = [],
  ) {
    const errorMessage =
      this.errorMessages[errorCode] ||
      DefaultErrorCode.errorMessages[errorCode];

    if (!errorMessage) {
      return new HttpErrors.BadGateway(errorCode);
    }

    if (parameters.length === 0) return errorMessage;

    return vsprintf(errorMessage, parameters);
  }

  /**
   * Errors
   *
   * @param errors
   * @param statusCode
   * @returns
   */
  static errors(errors: {[index: string]: string}, statusCode = 422) {
    return HttpErrors(statusCode || 422, {errors});
  }

  /**
   * Get Errors
   *
   * @param errors
   * @param key
   * @param errorCode
   * @param parameters
   * @returns
   */
  static getErrors(
    errors: {[index: string]: string},
    key: string,
    errorCode: string,
    parameters: (string | number)[] = [],
  ) {
    if (!errors[key]) {
      const errorDetails = this.error(errorCode, parameters);
      errors[key] = errorDetails ? errorDetails.message : errorCode;
    }

    return errors;
  }
}
