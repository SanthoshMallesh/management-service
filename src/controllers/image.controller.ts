import {inject} from '@loopback/core';
import {
  api,
  get,
  param,
  post,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import * as winston from 'winston';
/* Application */
import {bindObjects} from '../application';
import {ImageBL} from '../BL';
const multer = require('multer');
const path = require('path');

const IMAGE_FORMAT = ['jpg', 'jpeg', 'png'];

export interface ResponseObject {
  resultFile: {
    url: string;
  };
}

export interface ErrorResponse {
  statusCode: number;
  name: string;
  message: string;
}

@api({
  basePath: '/v1/images',
  paths: {},
})
export class ImageController {
  constructor(
    @bindObjects('imageBL', ImageBL)
    private imageBL: ImageBL,
    @inject('logger') private logger: winston.Logger,
    @inject(RestBindings.Http.RESPONSE) private res?: Response,
  ) {}

  @post('/file')
  async create(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    request: any, //eslint-disable-line
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    try {
      const storage = multer.diskStorage({
        destination: (req: any, file: any, cb: any) => {
          cb(null, 'Images');
        },
        filename: (req: any, file: any, cb: any) => {
          console.log(file);
          cb(null, Date.now() + path.extname(file.originalname));
        },
      });
      const upload = multer({
        storage,
      }).single('file');
      return await new Promise<ResponseObject | ErrorResponse>(
        (resolve, reject) => {
          upload(request, response, async (err: any) => {
            if (err) {
              reject(err.message);
            }

            if (!request.file) {
              reject('Invalid Image');
            }

            console.log(request.file);

            const fileExtension = request.file.originalname.split('.').pop();

            if (IMAGE_FORMAT.indexOf(fileExtension!.toLowerCase()) < 0) {
              reject('Invalid Image format');
            }

            resolve({resultFile: {url: request.file.filename}});
          });
        },
      );
    } catch (err) {
      this.logger.error('Upload Image error: ', err);
      return err;
    }
  }

  @get('/blob/{imageName}')
  async getImageStream(
    @param.path.string('imageName') imageName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const imageBuffer = await this.imageBL.getImageStream(imageName);
    console.log(JSON.stringify(imageName));
    console.log(JSON.stringify(imageName.split('.')[1]));
    response.setHeader(
      'Content-disposition',
      `attachemnt; filename=${imageName}`,
    );
    response.setHeader('Content-Type', `image/${imageName.split('.')[1]}`);
    response.send(imageBuffer);
  }
}
