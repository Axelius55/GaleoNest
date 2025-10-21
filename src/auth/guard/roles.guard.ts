import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user;

    if(!user){
      throw new ForbiddenException('Usuario no authenticado');
    }

    if(!user.rol){
      throw new ForbiddenException('Usuario sin rol')
    }

    const hasAccess = user.rol === roles;
    if (user.rol === Role.ADMIN) {
      return true;
    }
    
    if(!hasAccess){
      throw new ForbiddenException(
        `no tines accesoa a esta ruta: ${roles}, tu eres ${user.rol} jajaj`,
      )
    }

    
    return true;
  }
}
