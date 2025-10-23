import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';

export class UpdateUsuarioDto extends PartialType(RegisterDto) {
    
}
