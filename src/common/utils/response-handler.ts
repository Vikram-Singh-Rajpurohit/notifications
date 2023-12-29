import { HttpException } from '@nestjs/common'

export const responseHandler = async (action: any) => {
  try {
    const result = await action()
    return result
  } catch (error) {
    throw new HttpException(error, error.statusCode ?? 500)
  }
}
