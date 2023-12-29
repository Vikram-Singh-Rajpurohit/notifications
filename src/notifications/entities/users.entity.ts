import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({ timestamps: true })
export class UserEntity {
  @Prop({ required: true, trim: true, default: '' })
  name: string

  @Prop({ required: false, trim: true, default: '' })
  deviceToken: string

  @Prop({ required: false, trim: true, default: '' })
  emailId: string

  @Prop({ required: false, trim: true, default: '' })
  mobileNo: string
}
export const UserCollectionName = 'users'
export const UserSchema = SchemaFactory.createForClass(UserEntity)
