import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import admin from 'firebase-admin'
import { Model } from 'mongoose'
import { UserEntity } from '../entities/users.entity'
import * as Twilio from 'twilio'
import { ConfigService } from '@nestjs/config'
@Injectable()
export class NotificationsService {
  private readonly twilioClient: Twilio.Twilio
  constructor(
    @InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>,
    private readonly configService: ConfigService,
  ) {
    this.twilioClient = Twilio(this.configService.get('twilio.accountSID'), this.configService.get('twilio.authToken'))
  }

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
    const message = bodyParams?.message

    usersData.map(async (user) => {
      const mobileNo = user.mobileNo
      const emailId = user.emailId
      const sendSms = await this._sendSMS(mobileNo, message) // Send Sms using twilio
      returnResponse.sendSMS = sendSms
      console.log('🚀 ~ file: notifications.service.ts:38 ~ NotificationsService ~ usersData.map ~ sendSms:', sendSms)
    })

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

  async _sendSMS(recipientPhoneNumber: any, message: any) {
    try {
      const messageSentResponse = await this.twilioClient.messages.create({
        body: message,
        to: recipientPhoneNumber,
        from: this.configService.get('twilio.messagingServiceSID'), // Your Twilio phone number
      })
      return messageSentResponse.sid
    } catch (error) {
      console.error(`Error sending SMS: ${error.messageSentResponse}`)
    }
  }
}
