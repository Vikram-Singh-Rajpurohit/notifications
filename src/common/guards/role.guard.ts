import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class RoleGuard implements CanActivate {
  private rolePassed: string[]
  constructor(role: string[] | string) {
    if (typeof role == 'string') {
      this.rolePassed = [role]
    } else {
      this.rolePassed = role
    }
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp()
    const request: any = ctx.getRequest<Request>()
    return this.rolePassed.includes(request.user.role)
  }
}
