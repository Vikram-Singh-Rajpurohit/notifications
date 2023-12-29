import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { NotificationsService } from './notifications.service'

@Controller({ version: '1' })
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get('/')
  getHello(): string {
    return this.notificationService.getHello()
  }

  @Post('/send-notifications')
  async sendNotification(@Req() req: any, @Body() body: any): Promise<any> {
    return 'vikram'
  }
}
