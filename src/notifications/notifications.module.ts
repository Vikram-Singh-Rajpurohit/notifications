import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { I18nModule } from 'nestjs-i18n'
import * as path from 'path'
import config from '../config'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './services/notifications.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserCollectionName, UserEntity, UserSchema } from './entities/users.entity'

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
