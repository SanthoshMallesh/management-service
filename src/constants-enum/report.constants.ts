export enum ReportingIncentiveHeaders {
  NAME = 'Name',
  START_DATE_TIME = 'Start Date and Time',
  END_DATE_TIME = 'End Date and Time',
}

export enum ReportingVoucherHeaders {
  MINIMUM_PURCHASE_PRISE = 'Minimum Purchase Price',
}

export const ReportingHeadersSorting: string[] = [
  ReportingIncentiveHeaders.NAME,
  ReportingIncentiveHeaders.START_DATE_TIME,
  ReportingIncentiveHeaders.END_DATE_TIME,
  ReportingVoucherHeaders.MINIMUM_PURCHASE_PRISE,
];

export enum ReportWorkBookDetails {
  TITLE = 'Incentive Reports',
  REPORTS = 'Reports',
}
