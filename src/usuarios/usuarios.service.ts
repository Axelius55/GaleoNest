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
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
    private readonly awsService: AwsService,
  ) {}

  async create(registerDto: RegisterDto) {
    try {
      const usuarioGuardado = await this.usuarioRepository.save(registerDto);
      return usuarioGuardado;
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
    if (usuario.urlImage) {
      const fullUrl = `https://galeonest-s3-cloud.s3.us-east-2.amazonaws.com/usuarios/${usuario.urlImage}`;
      return { ...usuario, urlImageCompleta: fullUrl };
    }

    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
    user: UserActiveInterface,
  ) {
    if (user.rol !== Role.ADMIN && user.id !== id) {
      throw new ForbiddenException('Solo puedes actualizar tus propios datos');
    }

    if (updateUsuarioDto.contrasena) {
      updateUsuarioDto.contrasena = await bcryptjs.hash(
        updateUsuarioDto.contrasena,
        10,
      );
    }

    if (updateUsuarioDto.correo) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { correo: updateUsuarioDto.correo },
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

  async getStaticUserImage(imageName: string) {
    const url = `https://galeonest-s3-cloud.s3.us-east-2.amazonaws.com/usuarios/${imageName}`;
    return url;
  }

  async saveFile(file: Express.Multer.File, user: UserActiveInterface) {
    // Subir el archivo al bucket S3
    const { url, fileName } = await this.awsService.uploadFile(file);

    // Actualizar la URL de imagen en la base de datos
    await this.usuarioRepository.update(user.id, { urlImage: fileName });

    // Retornar la URL pública
    return { url, fileName };
  }

  async remove(id: string, user: UserActiveInterface) {
    if (user.rol !== Role.ADMIN && user.id !== id) {
      throw new ForbiddenException('Solo puedes eliminar tus propios datos');
    }
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
    return 'Usuario eliminado';
  }

  async findOneByEmailWhithPassword(correo: string) {
    return await this.usuarioRepository.findOne({
      where: { correo },
      select: ['id', 'correo', 'contrasena', 'rol', 'nombre'],
    });
  }

  async findOneByEmail(correo: string) {
    return await this.usuarioRepository.findOneBy({ correo });
  }
}

// async saveFile(file: Express.Multer.File, user: UserActiveInterface) {
//   const fs = require('fs');
//   const path = require('path');

//   const ext = file.mimetype.split('/')[1];
//   const fileName = `${uuid()}.${ext}`;
//   const uploadPath = path.join('./static/uploads', fileName);

//   // Escribe el archivo
//   fs.writeFileSync(uploadPath, file.buffer);

//   // Actualizar el campo urlImage del usuario
//   await this.usuarioRepository.update(user.id, {
//     urlImage: fileName,
//   });
