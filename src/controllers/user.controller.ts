import {api, get} from '@loopback/rest';

@api({
  basePath: 'v1/users',
  paths: {},
})
export class UserController {
  constructor() {}

  @get('/me')
  async getCurrentUser() {
    return {
      name: 'Mallesh, Santhosh',
      id: 'mallesh.sm',
      roles: [
        'CSP-MICS-SUPER-ADMIN-NONPROD',
        'CMP-MICS-SPECIALIST-NONPROD',
        'IRP-MICS-SUPER-ADMIN-NONPROD',
        'CMP-MICS-SUPER-ADMIN-NONPROD',
      ],
      scopes: [
        'AMS-READ',
        'AMS-COUPON-DOWNLOAD',
        'CAMPAIGN-READ',
        'CAMPAIGN-WRITE',
        'CAMPAIGN-DELETE',
        'CAMPAIGN-PUBLISH',
        'CAMPAIGN-DISABLE',
        'CAMPAIGN-PAUSE',
        'CAMPAIGN-REPUBLISH',
        'CAMPAIGN-EXPORT',
        'CAMPAIGN-DUPLICATE',
        'INCENTIVE-ID-READ',
        'INCENTIVE-ID-DOWNLOAD',
        'INCENTIVE-ID-UPLOAD',
      ],
      channels: [
        4567, 5766, 7284, 3847, 5209, 8100, 6583, 7121, 6896, 9712, 3722, 4728,
        4186, 5703, 2869, 3391, 4587, 9879, 5365, 8693, 5875, 4738, 3859, 3925,
        2946, 2649, 3827, 4827, 6486, 5547, 8107, 4926, 2850, 2947, 4285, 5285,
        4925, 3952, 5386, 4274, 6294, 8365, 8263, 3856, 4665, 4275, 7269,
      ],
      marketingPrograms: [
        310, 267, 288, 291, 277, 293, 265, 290, 249, 128, 401, 405, 478, 269,
        299, 296, 297, 300, 263, 436,
      ],
      internalMPIds: [
        7, 6, 21, 2, 14, 8, 10, 3, 20, 9, 15, 18, 5, 16, 11, 1, 4, 17, 19, 12,
      ],
    };
  }
}
