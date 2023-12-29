import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { UserEntity } from '../entities/users.entity'
import mongoose, { Model } from 'mongoose'
import admin from 'firebase-admin'
@Injectable()
export class NotificationsService {
  constructor(@InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {}
  getHello(): string {
    return 'Hello World!'
  }

  async sendNotification(bodyParams: any) {
    const usersData = await this.userModel.find().lean()
    if (!usersData || usersData.length == 0) {
      return true
    }

    const tokens = usersData.map((user) => user.deviceToken)
    const sendNotification = await this._sendNotification(tokens, bodyParams?.title, bodyParams?.message, {})
    console.log(
      '🚀 ~ file: notifications.service.ts:22 ~ NotificationsService ~ sendNotification ~ sendNotification:',
      sendNotification,
    )

    return sendNotification
  }

  async _sendNotification(deviceTokens: any[], title: string, message: string, data: any): Promise<any> {
    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens: deviceTokens,
        notification: {
          title,
          body: message,
        },
        data: Object.entries(data).reduce((acc, [key, value]) => {
          acc[key] = String(value) // Convert non-string values to strings
          return acc
        }, {}),
        apns: {
          payload: {
            aps: {
              badge: 1,
              sound: 'default',
            },
          },
        },
        android: {
          notification: {
            //icon: 'ic_notification',
            color: '#F16622',
          },
        },
        webpush: {
          fcmOptions: {
            link: 'https://example.com',
          },
        },
      })
      return response
    } catch (error) {
      return error
    }
  }
}
