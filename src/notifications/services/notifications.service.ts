import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { UserEntity } from '../entities/users.entity'
import mongoose, { Model } from 'mongoose'
@Injectable()
export class NotificationsService {
  constructor(@InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {}
  getHello(): string {
    return 'Hello World!'
  }

  async sendNotification(bodyParams: any) {
    const title = bodyParams?.title
    const message = bodyParams?.message
    const users = await this.userModel.find().lean()
    if (!users || users.length == 0) {
      return true
    }

    users.map((user) => {
      console.log('🚀 ~ file: notifications.service.ts:23 ~ NotificationsService ~ users.map ~ user:', user)

      if (user.emailId && user.emailId != '') {
        // email notification
      }

      if (user.mobileNo && user.mobileNo != '') {
        // sms notification
      }

      if (user.deviceToken && user.deviceToken != '') {
        // push notification
      }
    })

    return users
  }
}
