import { Logger, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NotificationsModule } from './notifications/notifications.module'

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule, { cors: true })
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  }) // Enable versioning

  const logger = new Logger()
  const configService = app.get(ConfigService)
  logger.log(
    `Notification server is listening on port ${configService.get('port')} | Environment: ${process.env.NODE_ENVIRONMENT}`,
  )

  const config = new DocumentBuilder()
    .setTitle('Notifications Service')
    .setDescription('The Notification API description')
    .setVersion('1.0')
    .addTag('notification')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(configService.get('port'))
}
bootstrap()
