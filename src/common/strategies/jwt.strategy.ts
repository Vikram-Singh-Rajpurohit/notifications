import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { PassportStrategy } from '@nestjs/passport'
import { passportJwtSecret } from 'jwks-rsa'
import { Model } from 'mongoose'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AdminEntity } from 'src/auth/entities/admin.entity'
import { UserEntity } from 'src/auth/entities/user.entity'
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>,
    config: ConfigService,
  ) {
    const { aws_user_pools_id, aws_cognito_region, aws_user_pools_web_client_id } = config.get('cognito')

    const issuer = `https://cognito-idp.${aws_cognito_region}.amazonaws.com/${aws_user_pools_id}`
    const jwksUri = `${issuer}/.well-known/jwks.json`
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: aws_user_pools_web_client_id,
      issuer,
      algorithms: ['RS256'],
      passReqToCallback: true,
    })
  }
  async validate(request: Request, payload: any): Promise<unknown> {
    const { identities, sub } = payload
    const providerName = identities?.[0]?.providerName ?? 'Email/Password'
    if (!payload.email) {
      if (providerName === 'Facebook') {
        payload.email = sub + '@rev-facebook.com'
        payload.loginType = 'Facebook'
      } else if (providerName === 'SignInWithApple') {
        payload.email = sub + '@rev-apple.com'
        payload.loginType = 'Apple'
      }
    }

    if (request.url === '/v1/users/sign-in' && request.method === 'POST') {
      payload.loginType = providerName
      return payload
    }

    const existingUser = await this.userModel.findOne({ email: payload.email })
    if (!existingUser || existingUser.isDeleted === true) {
      throw new UnauthorizedException({
        developerMessage: 'backendTexts.auth.developerMessage.userNotFoundInDatabase',
      })
    }
    if (existingUser.isBlocked === true) {
      throw new BadRequestException({
        userMessage: 'backendTexts.auth.userBlocked.message',
        userMessageCode: 'backendTexts.auth.userBlocked.messageCode',
        developerMessage: 'Your profile is blocked, please contact to admin',
      })
    }
    payload.userId = existingUser._id
    payload.firebaseUId = existingUser.firebaseUId
    payload.name = existingUser.name
    return payload
  }
}

export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    @InjectModel(AdminEntity.name)
    private readonly adminModel: Model<AdminEntity>,
    config: ConfigService,
  ) {
    const { aws_user_pools_id, aws_cognito_region, aws_user_pools_web_client_id } = config.get('cognito')

    const issuer = `https://cognito-idp.${aws_cognito_region}.amazonaws.com/${aws_user_pools_id}`
    const jwksUri = `${issuer}/.well-known/jwks.json`
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: aws_user_pools_web_client_id,
      issuer,
      algorithms: ['RS256'],
      passReqToCallback: true,
    })
  }
  async validate(request: Request, payload: any): Promise<unknown> {
    const { identities, sub } = payload
    const providerName = identities?.[0]?.providerName ?? 'Email/Password'

    if (request.url === '/v1/admin/sign-in' && request.method === 'POST') {
      payload.loginType = providerName
      return payload
    }

    const existingUser = await this.adminModel.findOne({
      email: payload.email,
    })
    if (!existingUser || existingUser.isDeleted === true) {
      throw new NotFoundException({
        developerMessage: 'backendTexts.admin.developerMessage.userNotFoundInDatabase',
      })
    }
    if (existingUser.isBlocked === true) {
      throw new BadRequestException({
        userMessage: 'backendTexts.admin.userBlocked.message',
        userMessageCode: 'backendTexts.admin.userBlocked.messageCode',
        developerMessage: 'Your profile is blocked, please contact to admin',
      })
    }
    payload.userId = existingUser._id
    payload.adminRole = existingUser.adminRole
    payload.name = existingUser.name
    return payload
  }
}
