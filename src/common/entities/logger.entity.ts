import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Date, SchemaTypes } from 'mongoose'

@Schema({ timestamps: true })
export class LoggerEntity {
  @Prop({ required: true })
  requestMethod: string

  @Prop({ required: true })
  requestUrl: string

  @Prop({ required: false, type: Object, default: null })
  requestHeaders: Record<string, any>

  @Prop({ required: false, type: Object, default: null })
  requestBody: Record<string, any>

  @Prop({ required: false })
  statusCode: number

  @Prop({ required: false, type: Object })
  responseBody: Record<string, any>

  @Prop({ required: false, type: SchemaTypes.Date })
  startTime: Date

  @Prop({ required: false, type: SchemaTypes.Date })
  endTime: Date

  @Prop({ required: false })
  executionTime: number

  @Prop({ required: false, default: '' })
  error: string
}
export const LoggerDatabaseName = 'loggers'
export const LoggerSchema = SchemaFactory.createForClass(LoggerEntity)
