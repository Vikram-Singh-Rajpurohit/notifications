import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationsService {
  getHello(): string {
    return 'Hello World!'
  }

  async sendNotification(bodyParams: any) {
    console.log('🚀 ~ file: notifications.service.ts:10 ~ NotificationsService ~ bodyParams:', bodyParams)
    return true
  }
}
