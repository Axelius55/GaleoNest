import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enums/rol.enum';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';

export function Auth(rol: Role) {
  return applyDecorators(Roles(rol), UseGuards(AuthGuard, RolesGuard));
}
