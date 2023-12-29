import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { map, Observable } from 'rxjs'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly i18n: I18nService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((responseData) => {
        //console.log("🚀 ~ file: response.interceptor.ts:13 ~ ResponseInterceptor ~ map ~ responseData", responseData)
        const [req, res] = context.getArgs()

        let userMessage = responseData?.userMessage ?? ''
        let userMessageCode = responseData?.userMessageCode ?? ''

        responseData = typeof responseData === 'string' ? { message: responseData } : (responseData as object)

        const formattedResponse = {
          statusCode: responseData.statusCode ? responseData.statusCode : 200,
          success: responseData.success === false ? false : true,
          userMessage: userMessage ? this.i18n.t(userMessage, { args: responseData?.args }) : '',
          userMessageCode: userMessageCode ? this.i18n.t(userMessageCode) : '',
          developerMessage: responseData.developerMessage,
          data: responseData.data || {},
          timestamp: new Date().toISOString(),
        }
        //console.log("🚀 ~ file: response.interceptor.ts:32 ~ ResponseInterceptor ~ map ~ formattedResponse", formattedResponse)
        return formattedResponse
      }),
    )
  }
}
