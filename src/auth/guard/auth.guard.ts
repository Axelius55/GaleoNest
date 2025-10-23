import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from "express";
import { ConfigService } from '@nestjs/config';
import { BlacklistService } from '../blacklist.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly blacklistService: BlacklistService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request)

    if(!token){
      throw new UnauthorizedException();
    }

    if (this.blacklistService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token inválido (sesión cerrada)');
    }

    try{
      const payload = await this.jwtService.verifyAsync(token,{
        secret: this.configService.get<string>('JWT_SECRET')
      });
      
      request.user = {
        id: payload.sub,
        email: payload.correo,
        rol: payload.rol
      };
      
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true
  }

  private extractTokenFromHeader(request: Request){
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined
  }
}
