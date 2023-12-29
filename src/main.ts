import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NotificationsModule } from './notifications/notifications.module'

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule)
  const logger = new Logger()
  const configService = app.get(ConfigService)
  logger.log(
    `Notification server is listening on port ${configService.get('port')} | Environment: ${process.env.NODE_ENVIRONMENT}`,
  )

  await app.listen(3000)
}
bootstrap()
