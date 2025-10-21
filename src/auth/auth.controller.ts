import { Role } from 'src/common/enums/rol.enum';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { Auth } from '../common/decorators/auth.decoratot';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interface/user-active.interface';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

interface RequestWithUser extends Request {
  usuario: {
    correo: string;
    rol: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registro solo con datos necesarios: nombre, contraseña y correo' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login solo con correo y contrasena' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Solo usuarios autorizados' })
  @ApiBearerAuth()
  @Auth(Role.USER)
  porfile(@ActiveUser() usuario: UserActiveInterface) {
    console.log(usuario)
    return this.authService.profile(usuario);
  }
}
