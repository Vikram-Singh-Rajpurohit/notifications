import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { I18nService } from 'nestjs-i18n'
import { map, Observable } from 'rxjs'
import { LoggerEntity } from '../entities/logger.entity'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    @InjectModel(LoggerEntity.name)
    private readonly loggerModel: Model<LoggerEntity>,
    private readonly i18n: I18nService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((responseData) => {
        const [req, res] = context.getArgs()

        const startTime = +req._startTime
        const endTime = +new Date()
        const reqTime = endTime - startTime
        res.statusCode = responseData?.statusCode || HttpStatus.OK

        let userMessage = responseData?.userMessage ?? ''
        let userMessageCode = responseData?.userMessageCode ?? ''
        let developerMessage = responseData?.developerMessage ?? ''

        const formattedResponse = {
          statusCode: res.statusCode,
          success: responseData.success === false ? false : true,
          message: userMessage ? this.i18n.t(userMessage) : '',
          messageCode: userMessageCode ? this.i18n.t(userMessageCode) : '',
          developerMessage: developerMessage ? responseData.developerMessage : '',
          data: responseData.data || {},
        }

        this.loggerModel.create({
          requestMethod: req.method,
          requestUrl: req.url,
          requestHeaders: req.headers,
          requestBody: req.body,
          statusCode: res.statusCode,
          responseBody: formattedResponse,
          startTime,
          endTime,
          executionTime: reqTime,
        })
        return formattedResponse
      }),
    )
  }
}
