import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { sendNotificationsDto } from './dto/send-notification.dto'

@Controller({ version: '1' })
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get('/')
  getHello(): string {
    return this.notificationService.getHello()
  }

  @Post('/send-notifications')
  async sendNotification(@Body() bodyParams: sendNotificationsDto): Promise<any> {
    console.log(
      '🚀 ~ file: notifications.controller.ts:16 ~ NotificationsController ~ sendNotification ~ bodyParams:',
      bodyParams,
    )
    return 'vikram'
  }
}
