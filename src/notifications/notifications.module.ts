import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { join } from 'path'
import config from '../config'
import { UserCollectionName, UserEntity, UserSchema } from './entities/users.entity'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './services/notifications.service'
console.log('🚀 ~ file: notifications.module.ts:49 ~ useFactory: ~ __dirname:', join(__dirname, './templates/'))
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: UserEntity.name,
        schema: UserSchema,
        collection: UserCollectionName,
      },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Import the ConfigModule
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mailer.transport.host'),
          port: configService.get<number>('mailer.transport.port'),
          auth: {
            user: configService.get<string>('mailer.transport.auth.user'),
            pass: configService.get<string>('mailer.transport.auth.pass'),
          },
        },
        defaults: {
          from: configService.get<string>('mailer.defaults.from'),
        },
        template: {
          dir: join(__dirname, './templates/'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
