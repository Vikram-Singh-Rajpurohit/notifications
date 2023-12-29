import { ApiProperty } from '@nestjs/swagger'
export class sendNotificationsDto {
  @ApiProperty()
  title: string

  @ApiProperty()
  message: string
}
