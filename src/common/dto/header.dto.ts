import { Expose } from 'class-transformer'
import { IsDefined, IsOptional, IsString, Matches } from 'class-validator'

export class HeaderDto {
  @IsDefined()
  @IsString()
  @Expose({ name: 'time-zone' })
  @IsOptional()
  timeZone: string

  @IsDefined()
  @IsString()
  @Expose({ name: 'app-environment' })
  @IsOptional()
  readonly appEnvironment: String

  @IsDefined()
  @Expose({ name: 'device-name' })
  @IsOptional()
  readonly deviceName: String

  @IsDefined()
  @Expose({ name: 'device-id' })
  @IsOptional()
  readonly deviceId: string

  @IsDefined()
  @Expose({ name: 'device-type' })
  @IsOptional()
  readonly deviceType: String

  @IsDefined()
  @Expose({ name: 'app-version' })
  @IsOptional()
  readonly appVersion: String

  @IsDefined()
  @Expose({ name: 'device-token' })
  @IsOptional()
  readonly deviceToken: string

  @IsDefined()
  @Expose({ name: 'os-version' })
  @IsOptional()
  readonly osVersion: String

  @IsDefined()
  @Expose({ name: 'ip-address' })
  @IsOptional()
  readonly ipAddress: String

  @IsOptional()
  readonly city: String

  @IsOptional()
  readonly county: String

  @IsOptional()
  readonly state: String

  @IsOptional()
  readonly country: String

  @IsDefined()
  @IsOptional()
  readonly longitude: string

  @IsDefined()
  @IsOptional()
  readonly latitude: string
}
