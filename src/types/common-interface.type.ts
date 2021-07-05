export interface ValidationFilds {
  maxNumber: string;
  minNumber: string;
  required: boolean;
  requiredForPublish: boolean;
  duplicateCheck: boolean;
}

export interface FieldConfigPropertiesValidation {
  validation: ValidationFilds;
}
