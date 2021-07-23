import {inject} from '@loopback/core';
import * as winston from 'winston';
const fs = require('fs');
export class ImageBL {
  constructor() {}
  @inject('logger') private logger: winston.Logger;

  /**
   * Get Image Stream
   * @param imageName
   */
  async getImageStream(imageName: string): Promise<Buffer> {
    this.logger.info('getImageStream BL : converting to buffer');
    const fileInfo = fs.readFileSync(`Images/${imageName}`);
    if (fileInfo instanceof Buffer) {
      return fileInfo;
    } else {
      return Buffer.from(fileInfo);
    }
  }
}
