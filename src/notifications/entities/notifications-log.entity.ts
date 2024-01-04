import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({ timestamps: true })
export class NotificationsLogEntity {
  @Prop({ required: true, type: mongoose.Types.ObjectId, trim: true, default: '' })
  userId: string

  @Prop({
    required: false,
    trim: true,
    enum: { EMAIL: 'EMAIL', SMS: 'SMS', PUSH_NOTIFICATION: 'PUSH_NOTIFICATION' },
    default: '',
  })
  type: string

  @Prop({ required: false, trim: true, default: {} })
  details: {}

  @Prop({ required: false, default: false })
  status: boolean
}
export const NotificationsLogCollectionName = 'notifications-log'
export const NotificationsLogSchema = SchemaFactory.createForClass(NotificationsLogEntity)
