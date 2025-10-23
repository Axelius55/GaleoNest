import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserActiveInterface } from 'src/common/interface/user-active.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const usuario = await this.usuariosService.findOneByEmailWhithPassword(
      registerDto.correo,
    );

    if (usuario) {
      throw new BadRequestException('El correo ya esta en uso');
    }

    const hashedPassword = await bcryptjs.hash(registerDto.contrasena, 10);

    const usuarioCreado = await this.usuariosService.create({
      ...registerDto,
      contrasena: hashedPassword,
    });

    return {
      id: usuarioCreado?.id,
      nombre: registerDto.nombre,
      correo: registerDto.correo,
      presupuesto: registerDto.presupuesto,
    };
  }

  async login({ correo, contrasena }: LoginDto) {
    const usuario =
      await this.usuariosService.findOneByEmailWhithPassword(correo);

    if (!usuario) {
      throw new UnauthorizedException('No existe usuario');
    }

    const isPasswordValid = await bcryptjs.compare(
      contrasena,
      usuario.contrasena,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contasena incorrecta');
    }

    const payload = {
      email: usuario.correo,
      rol: usuario.rol,
      sub: usuario.id,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      correo,
    };
  }

  async profile(user: UserActiveInterface) {
    return await this.usuariosService.findOneByEmail(user.email);
  }
}
