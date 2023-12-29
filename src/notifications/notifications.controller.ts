import { Controller, Get } from '@nestjs/common'
import { NotificationsService } from './notifications.service'

@Controller()
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  getHello(): string {
    return this.notificationService.getHello()
  }
}
