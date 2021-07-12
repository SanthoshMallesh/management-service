import {api, get} from '@loopback/rest';
/* Application */
import {bindObjects} from '../application';
/* BL */
import {FieldConfigBL} from '../BL';
import {FieldConfig} from '../models';

@api({
  basePath: '/v1/fieldConfig',
  paths: {},
})
export class FieldConfigController {
  constructor(
    @bindObjects('fieldConfigBL', FieldConfigBL)
    private fieldConfigBL: FieldConfigBL,
  ) {}

  /**
   *Get FieldConfig List
   */
  @get('/')
  async list(): Promise<FieldConfig[]> {
    return this.fieldConfigBL.getList();
  }
}
