import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { I18nService } from 'nestjs-i18n'
import { LoggerEntity } from '../entities/logger.entity'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @InjectModel(LoggerEntity.name)
    private readonly loggerModel: Model<LoggerEntity>,
    private readonly i18n: I18nService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): any {
    const [req] = host.getArgs()
    const startTime = +req._startTime
    const endTime = +new Date()
    const reqTime = endTime - startTime

    // In certain situations `httpAdapter` might not be available in the constructor method, thus we should resolve it here.

    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    let formattedResponse = {}

    if (exception instanceof HttpException) {
      const exceptionResponse: any = exception.getResponse()
      const statusCode = exception.getStatus()
      let userMessage = exceptionResponse?.userMessage
      let userMessageCode = exceptionResponse.userMessageCode
      let developerMessage = exceptionResponse?.developerMessage || exceptionResponse?.message || 'Something wend wrong'

      if (exception.getStatus() === 400) {
        userMessage = userMessage || this.i18n.t('backendTexts.badRequestException.message')
        userMessageCode = userMessageCode || this.i18n.t('backendTexts.badRequestException.messageCode')
      }

      //To cutomize system generated error messages
      switch (developerMessage) {
        case 'Unauthorized':
          developerMessage = this.i18n.t('backendTexts.auth.developerMessage.unauthorized')
          userMessage = this.i18n.t('backendTexts.auth.unauthorized.message')
          userMessageCode = this.i18n.t('backendTexts.auth.unauthorized.messageCode')
          break
        case 'Forbidden resource':
          developerMessage = this.i18n.t('backendTexts.auth.developerMessage.forbiddenResource')
          break
      }

      formattedResponse = {
        statusCode,
        success: false,
        message: userMessage ? this.i18n.t(userMessage) : this.i18n.t('backendTexts.auth.userMessage.message'),
        messageCode: userMessageCode ? this.i18n.t(userMessageCode) : this.i18n.t('backendTexts.auth.userMessage.messageCode'),
        developerMessage: typeof developerMessage === 'string' ? this.i18n.t(developerMessage) : developerMessage.toString(),
        data: {},
      }
    }
    // handling error if any microservice is down
    else if (exception['errno'] === -111) {
      formattedResponse = {
        statusCode: 503,
        success: false,
        message: `Unable to establish connection with the server at address '${exception['address']}' and port '${exception['port']}'.`,
        data: exception,
      }
    } else if (
      typeof exception === 'string' &&
      exception === 'There is no matching message handler defined in the remote service.'
    ) {
      formattedResponse = {
        statusCode: 404,
        success: false,
        developerMessage: 'There is no matching message handler defined in the remote service.',
        data: {},
      }
    } else {
      formattedResponse = exception
    }

    if (req.url !== '/') {
      this.loggerModel.create({
        requestMethod: req.method,
        requestUrl: req.url,
        requestHeaders: req.headers,
        requestBody: req.body,
        statusCode: formattedResponse['statusCode'],
        responseBody: formattedResponse,
        startTime,
        endTime,
        executionTime: reqTime,
      })
    }
    httpAdapter.reply(ctx.getResponse(), formattedResponse, formattedResponse['statusCode'])
  }
}
