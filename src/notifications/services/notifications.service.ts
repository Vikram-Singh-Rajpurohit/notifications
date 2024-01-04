import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import admin from 'firebase-admin'
import { Model } from 'mongoose'
import { UserEntity } from '../entities/users.entity'
import * as Twilio from 'twilio'
import { ConfigService } from '@nestjs/config'
import { MailerService } from '@nestjs-modules/mailer'
import { join } from 'path'
@Injectable()
export class NotificationsService {
  private readonly twilioClient: Twilio.Twilio
  constructor(
    @InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.twilioClient = Twilio(this.configService.get('twilio.accountSID'), this.configService.get('twilio.authToken'))
  }

  async sendNotification(bodyParams: any) {
    const returnResponse: any = {}
    const usersData = await this.userModel.find().lean()

    if (!usersData || usersData.length == 0) {
      return true
    }
    const message = bodyParams?.message
    const title = bodyParams?.title

    const tokens = []

    usersData.map(async (user) => {
      if (user?.deviceToken) {
        tokens.push(user.deviceToken)
      }
      if (user?.mobileNo) {
        const mobileNo = user?.mobileNo
        const sendSms = this._sendSMS(mobileNo, message) // Send Sms using twilio
        returnResponse.sendSMS = sendSms
      }
      if (user?.emailId) {
        const emailId = user?.emailId
        const sendEmail = this._sendEmail(emailId, title, message) // Send Email
        returnResponse.sendEmail = sendEmail
      }
    })

    if (tokens.length > 0) {
      const sendNotification = this._sendNotification(tokens, title, message, {}) // Send Push notifications
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
      console.log(
        '🚀 ~ file: notifications.service.ts:89 ~ NotificationsService ~ response ~ response:',
        JSON.stringify(response),
      )
      return response
    } catch (error) {
      console.log('🚀 ~ file: notifications.service.ts:92 ~ NotificationsService ~ _sendNotification ~ error:', error)
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

  async _sendEmail(recipientEmail: string, subject: string, message: any) {
    try {
      const sendEmailResponse = await this.mailerService.sendMail({
        to: recipientEmail,
        subject: subject,
        template: './notification', //add your custom template
        context: { message },
      })
      console.log('🚀 ~ Email notification sent successfully to ', sendEmailResponse, recipientEmail)
      return sendEmailResponse
    } catch (error) {
      console.error('🚀 ~ Email notification failed to send to', recipientEmail, error)
    }
  }
}
