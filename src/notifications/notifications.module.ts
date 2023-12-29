import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { I18nModule } from 'nestjs-i18n'
import * as path from 'path'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './services/notifications.service'

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { UserCollectionName, UserEntity, UserSchema } from './entities/users.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('language'),
        loaderOptions: {
          path: path.join(__dirname, '../common/backend-texts/'),
          watch: true,
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: process.env.MONGODB_URI,
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
