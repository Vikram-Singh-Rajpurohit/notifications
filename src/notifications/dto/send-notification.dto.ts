import { ApiProperty } from '@nestjs/swagger'
export class sendNotificationsDto {
  @ApiProperty()
  deviceType: []

  @ApiProperty()
  title: string

  @ApiProperty()
  message: string
}
