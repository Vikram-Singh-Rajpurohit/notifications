import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator'

export class PaginationDto {
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  page: number

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  limit: number

  @IsString()
  @IsOptional()
  sortKey: string

  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: string

  @IsString()
  @IsOptional()
  search: string
}
