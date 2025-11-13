import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserActiveInterface } from 'src/common/interface/user-active.interface';
import { Role } from 'src/common/enums/rol.enum';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService
  ) {}

  async create(registerDto: RegisterDto) {
    try {
      return await this.usuarioRepository.save(registerDto);
    } catch (error) {
      this.commonService.handleDBExceptions(error);
    }
  }

  //TODO: PONER PAGINACIÓN
  findAll() {
    return this.usuarioRepository.find();
  }

  async findOne(id: string, user?: UserActiveInterface) {
    if (user && user.rol !== Role.ADMIN && user.id !== id) {
      throw new ForbiddenException('Solo puedes ver tus propios datos');
    }

    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto, user: UserActiveInterface) {
    if (user.rol !== Role.ADMIN && user.id !== id) {
      throw new ForbiddenException('Solo puedes actualizar tus propios datos');
    }

    if (updateUsuarioDto.contrasena) {
      updateUsuarioDto.contrasena = await bcryptjs.hash(updateUsuarioDto.contrasena, 10);
    }

    if (updateUsuarioDto.correo) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { correo: updateUsuarioDto.correo }
      });
      
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('El correo ya está en uso');
      }
    }

    const updateUsuario = await this.usuarioRepository.preload({
      id,
      ...updateUsuarioDto,
    });

    if (!updateUsuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    await this.usuarioRepository.save(updateUsuario);

    const { contrasena, ...usuarioSinPassword } = updateUsuario;
    return usuarioSinPassword;
  }

  getStaticProductImage(imageName: string) {
    
    const path = join(__dirname, '../../static/uploads', imageName)

    if(!existsSync(path)){
        throw new BadRequestException(`No product found with image: ${imageName}`)
    }
    return path;

  }

  saveFile(file: Express.Multer.File) {
    const fs = require('fs');
    const path = require('path');

    const ext = file.mimetype.split('/')[1]; // 'jpeg', 'png', etc.
    const fileName = `${uuid()}.${ext}`; // uuid + extensión
    const uploadPath = path.join('./static/uploads', fileName); // Ruta completa

    // Escribe el archivo
    fs.writeFileSync(uploadPath, file.buffer);
    // Retorna la URL segura
    const secureUrl = `${this.configService.get('HOST_API')}/usuarios/photo/${fileName}`
    return secureUrl;
  }

  async remove(id: string) {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
    return 'Usuario eliminado';
  }

  async findOneByEmailWhithPassword(correo: string){
    return await this.usuarioRepository.findOne({
      where: {correo},
      select: ['id', 'correo','contrasena','rol','nombre']
    });
  }

  async findOneByEmail(correo: string){
    return await this.usuarioRepository.findOneBy({correo})
  }

  async actualizarPresupuesto(id: string, presupuesto: number, user: UserActiveInterface) {
  if (user.rol !== Role.ADMIN && user.id !== id) {
    throw new ForbiddenException('Solo puedes actualizar tu propio presupuesto');
  }

  const usuario = await this.usuarioRepository.findOneBy({ id });
  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  usuario.presupuesto = presupuesto;
  await this.usuarioRepository.save(usuario);

  return { message: 'Presupuesto actualizado correctamente', presupuesto };
}


  
}
