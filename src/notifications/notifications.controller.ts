import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { RequestHeaders } from '../common/decorators/request-header.decorator'
import { NotificationsService } from './notifications.service'

@Controller({ version: '1' })
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get('/')
  getHello(): string {
    return this.notificationService.getHello()
  }

  @Post('/send-notifications')
  async sendNotification(@Req() req: any, @RequestHeaders() headers: any, @Body() body: any): Promise<any> {}
}
