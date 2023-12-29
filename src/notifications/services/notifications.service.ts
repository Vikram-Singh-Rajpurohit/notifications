import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationsService {
  getHello(): string {
    return 'Hello World!'
  }

  async sendNotification(bodyParams: any) {
    const title = bodyParams?.title
    const message = bodyParams?.message

    console.log('🚀 ~ file: notifications.service.ts:10 ~ NotificationsService ~ bodyParams:', bodyParams)
    return true
  }
}
