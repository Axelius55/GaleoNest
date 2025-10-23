import { Role } from 'src/common/enums/rol.enum';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Headers
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { Auth } from '../common/decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interface/user-active.interface';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BlacklistService } from './blacklist.service';

interface RequestWithUser extends Request {
  usuario: {
    correo: string;
    rol: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly blacklistService: BlacklistService
  ) {}

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
    return this.authService.profile(usuario);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión (invalidar token actual)' })
  @ApiBearerAuth()
  @Auth(Role.USER)
  logout(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    
    if (token) {
      this.blacklistService.addToBlacklist(token);
    }
    
    return {
      message: 'Sesión cerrada correctamente. Token invalidado.',
      timestamp: new Date().toISOString()
    };
  }

}
