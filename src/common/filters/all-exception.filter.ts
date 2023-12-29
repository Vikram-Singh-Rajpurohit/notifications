import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { throwError } from 'rxjs'
import { PaymentRequiredException } from '../exceptions/payment-required.exception'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  catch(exception: any, host: ArgumentsHost): any {
    console.log('🚀 ~ file: all-exception.filter.ts:14 ~ AllExceptionsFilter ~ exception', exception)
    if (exception instanceof BadRequestException) {
      const exceptionResponse: any = exception.getResponse()
      const statusCode = exception.getStatus()
      const userMessage = exceptionResponse?.userMessage || ''
      const userMessageCode = exceptionResponse?.userMessageCode || ''
      const developerMessage = exceptionResponse?.developerMessage || exceptionResponse.message || ''
      const args = exceptionResponse?.args || {}

      const formattedResponse = {
        statusCode,
        success: false,
        message: userMessage ? this.i18n.t(userMessage, { args }) : this.i18n.t('backendTexts.badRequestException.message'),
        messageCode: userMessageCode ? this.i18n.t(userMessageCode) : this.i18n.t('backendTexts.badRequestException.messageCode'),
        developerMessage: typeof developerMessage === 'string' ? this.i18n.t(developerMessage) : developerMessage.toString(),
        data: {},
      }
      return throwError(() => formattedResponse)
    } else if (exception instanceof NotFoundException) {
      const exceptionResponse: any = exception.getResponse()
      const statusCode = exception.getStatus()
      const userMessage = exceptionResponse?.userMessage || ''
      const userMessageCode = exceptionResponse?.userMessageCode || ''
      const developerMessage = exceptionResponse?.developerMessage || exceptionResponse.message || ''
      const formattedResponse = {
        statusCode,
        success: false,
        message: userMessage ? this.i18n.t(userMessage) : this.i18n.t('backendTexts.notFoundException.message'),
        messageCode: userMessageCode ? this.i18n.t(userMessageCode) : this.i18n.t('backendTexts.notFoundException.messageCode'),
        developerMessage: typeof developerMessage === 'string' ? this.i18n.t(developerMessage) : developerMessage.toString(),
        data: {},
      }
      return throwError(() => formattedResponse)
    } else if (exception instanceof PaymentRequiredException) {
      const exceptionResponse: any = exception.getResponse()
      const statusCode = exception.getStatus()
      const userMessage = exceptionResponse?.userMessage || ''
      const userMessageCode = exceptionResponse?.userMessageCode || ''
      const developerMessage = exceptionResponse?.developerMessage || exceptionResponse.message || ''
      const formattedResponse = {
        statusCode,
        success: false,
        message: userMessage ? this.i18n.t(userMessage) : this.i18n.t('backendTexts.paymentRequiredException.message'),
        messageCode: userMessageCode
          ? this.i18n.t(userMessageCode)
          : this.i18n.t('backendTexts.paymentRequiredException.messageCode'),
        developerMessage: typeof developerMessage === 'string' ? this.i18n.t(developerMessage) : developerMessage.toString(),
        data: {},
      }
      return throwError(() => formattedResponse)
    } else {
      const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      const formattedResponse = {
        statusCode: httpStatus,
        success: false,
        message: 'something went wrong please try again later',
        messageCode: '1100',
        developerMessage: exception.message ? this.i18n.t(exception.message) : 'Something Bad happend',
        data: {},
      }
      return throwError(() => formattedResponse)
    }
  }
}
