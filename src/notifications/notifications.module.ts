import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { I18nModule } from 'nestjs-i18n'
import * as path from 'path'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { AllExceptionsFilter } from '../common/filters/all-exception.filter'
import { ResponseInterceptor } from '../common/interceptors/response.interceptor'
import config from '../config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
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
        uri: configService.get<string>('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([]),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class NotificationsModule {}
