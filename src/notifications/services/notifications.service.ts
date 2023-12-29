import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import admin from 'firebase-admin'
import { Model } from 'mongoose'
import { UserEntity } from '../entities/users.entity'
@Injectable()
export class NotificationsService {
  constructor(@InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {}

  async sendNotification(bodyParams: any) {
    const returnResponse: any = {}
    const usersData = await this.userModel.find().lean()
    if (!usersData || usersData.length == 0) {
      return true
    }

    const tokens = usersData.map((user) => user.deviceToken)
    if (tokens.length > 0) {
      const sendNotification = await this._sendNotification(tokens, bodyParams?.title, bodyParams?.message, {})
      returnResponse.sendNotification = sendNotification
    }
    return returnResponse
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
