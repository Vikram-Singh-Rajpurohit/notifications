import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { NotificationsService } from './services/notifications.service'
import { sendNotificationsDto } from './dto/send-notification.dto'
@Controller({ version: '1' })
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post('/send-notifications')
  async sendNotification(@Body() bodyParams: sendNotificationsDto): Promise<any> {
    return await this.notificationService.sendNotification(bodyParams)
  }
}
