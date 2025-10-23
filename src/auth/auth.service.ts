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

    await this.usuariosService.create({
      nombre: registerDto.nombre,
      correo: registerDto.correo,
      contrasena: hashedPassword,
      presupuesto: registerDto.presupuesto,
    });

    return {
      message: 'Usuario creado con exito',
    };
  }

  async login({ correo, contrasena }: LoginDto) {
    const usuario = await this.usuariosService.findOneByEmailWhithPassword(correo);

    if (!usuario) {
      throw new UnauthorizedException('Correo Incorrecto');
    }

    const isPasswordValid = await bcryptjs.compare(
      contrasena,
      usuario.contrasena,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contasena incorrecta');
    }

    const payload = { correo: usuario.correo, rol: usuario.rol, sub: usuario.id};

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      correo,
    };
  }

  async profile({email, rol}: {email: string, rol: string}){

    // if(rol !=='admin'){
    //   throw new UnauthorizedException('No estas autorizado para acceder a esre recurso')
    // }

    return await this.usuariosService.findOneByEmail(email)
  }

  
}
