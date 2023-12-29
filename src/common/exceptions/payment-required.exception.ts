import { HttpException, HttpStatus } from '@nestjs/common'

export class PaymentRequiredException extends HttpException {
  constructor(exceptionObject: Record<string, any>) {
    super(exceptionObject, HttpStatus.PAYMENT_REQUIRED)
  }
}
