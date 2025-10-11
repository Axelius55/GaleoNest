import {
  BadRequestException,
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

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      return await this.usuarioRepository.save(createUsuarioDto);
    } catch (error) {
      this.commonService.handleDBExceptions(error);
    }
  }

  //TODO: PONER PAGINACIÓN
  findAll() {
    return this.usuarioRepository.find();
  }

  async findOne(id: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`No se encontro el ${id}`);
    }
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {

    const updateUsuario = await this.usuarioRepository.preload({
      id,
      ...updateUsuarioDto,
    });

    if (!updateUsuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    await this.usuarioRepository.save(updateUsuario);

    return updateUsuario;
    
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
}
