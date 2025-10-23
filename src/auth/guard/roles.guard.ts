import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('🔐 Rol requerido:', requiredRole);

    // Si no hay rol requerido, permitir acceso
    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('👤 Usuario en request:', user);
    console.log('🔍 Tipo de rol:', typeof user?.rol, 'Valor:', user?.rol);

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (!user.rol) {
      throw new ForbiddenException('Usuario sin rol');
    }

    // ADMIN tiene acceso a todo
    if (user.rol === Role.ADMIN) {
      return true;
    }

    // Para otros roles, verificar que coincida con el requerido
    if (user.rol !== requiredRole) {
      throw new ForbiddenException(
        `No tienes acceso a esta ruta. Se requiere: ${requiredRole}, tu rol es: ${user.rol}`,
      );
    }

    return true;
  }
}
