import { Controller, Get } from '@nestjs/common'
import { NotificationsService } from './notifications.service'

@Controller({ version: '1' })
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get('/')
  getHello(): string {
    return this.notificationService.getHello()
  }
}
