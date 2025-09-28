import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly commonService: CommonService,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      return await this.categoriaRepository.save(createCategoriaDto);
    } catch (error) {
      this.commonService.handleDBExceptions(error);
    }
  }

  
  findAll() {
    return this.categoriaRepository.find();
  }

  async findOne(id: string) {
    const categoria = await this.categoriaRepository.findOneBy({id});
    if(!categoria) throw new NotFoundException(`No se encontro el id: ${id}`);
    return categoria;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const updateCategoria = await this.categoriaRepository.preload({
      id,
      ...updateCategoriaDto
    });
    if(!updateCategoria) throw new NotFoundException(`No se encontro el id: ${id}`);
    await this.categoriaRepository.save(updateCategoria);
    return updateCategoria
  }

  async remove(id: string) {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);
    return "categoria eliminada";
  }
}
