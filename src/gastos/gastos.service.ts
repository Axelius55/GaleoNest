import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,

    private readonly commonService: CommonService,
  ) {}

  

  async create(createGastoDto: CreateGastoDto) {
      const usuario = await this.usuarioRepository.findOneBy({
        id: createGastoDto.usuarioID,
      });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');

      const categoria = await this.categoriaRepository.findOneBy({
        id: createGastoDto.categoriaID,
      });
      if (!categoria) throw new NotFoundException('Categoría no encontrada');

      const gasto = this.gastoRepository.create({
        nombreGasto: createGastoDto.nombreGasto,
        monto: createGastoDto.monto,
        fechaGasto: createGastoDto.fechaGasto,
        descripcion: createGastoDto.descripcion,
        usuario, // entidad completa
        categoria // entidad completa
      });

      return await this.gastoRepository.save(gasto);

  }
  //TODO: poner paginación
  findAll() {
    return this.gastoRepository.find();
  }

  async findOne(id: string) {
    const gasto = await this.gastoRepository.findOneBy({ id });
    if (!gasto) {
      throw new NotFoundException(`No se encontro el id: ${id}`);
    }
    return gasto;
  }

  async update(id: string, updateGastoDto: UpdateGastoDto) {
/*   const gasto = await this.gastoRepository.findOne({
    where: { id },
    relations: ['categoria'], // solo cargamos la categoría si se va a actualizar
  }); */

  const {usuarioID, ...toUpdate} = updateGastoDto;

  const gasto = await this.gastoRepository.preload({
    ...toUpdate,
    id,
  })

  if (!gasto) throw new NotFoundException(`Gasto con id ${id} no encontrado`);

  // Actualizamos la categoría solo si se manda
  if (updateGastoDto.categoriaID) {
    const categoria = await this.categoriaRepository.findOneBy({ id: updateGastoDto.categoriaID });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    gasto.categoria = categoria;
  }
  return await this.gastoRepository.save(gasto);
}

  async remove(id: string) {
    const gasto = await this.findOne(id);
    await this.gastoRepository.remove(gasto);
    return 'Gasto eliminado';
  }
}
