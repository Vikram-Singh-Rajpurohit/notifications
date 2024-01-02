import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import * as path from 'path'
import config from '../config'
import { UserCollectionName, UserEntity, UserSchema } from './entities/users.entity'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './services/notifications.service'
import { join } from 'path'
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
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
        // template: {    // add your custom template for email
        //   dir: join(__dirname, './templates/'),
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
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
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
