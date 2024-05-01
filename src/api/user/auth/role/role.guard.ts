import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import ERole from './role.enum';
import { ROLES_KEY } from './role.decorator';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authHelper: AuthHelper) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    const user = await this.authHelper.decode(token);
    request.id = user.id;
    return requiredRoles.some((role) => user.role === role);
  }
}
