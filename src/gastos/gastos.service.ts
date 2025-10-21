import { UserActiveInterface } from './../common/interface/user-active.interface';
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

  

  async create(createGastoDto: CreateGastoDto, user: UserActiveInterface) {
    const categoria = await this.categoriaRepository.findOneBy({
      id: createGastoDto.categoriaID,
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const gasto = this.gastoRepository.create({
      nombreGasto: createGastoDto.nombreGasto,
      monto: createGastoDto.monto,
      fechaGasto: createGastoDto.fechaGasto,
      descripcion: createGastoDto.descripcion,
      user: { id: user.id } as Usuario,
      categoria
    });

    return await this.gastoRepository.save(gasto);
  }
  //TODO: poner paginación
  findAll(user: UserActiveInterface) {
    return this.gastoRepository.find({
      where: {user: {id: user.id}},
      relations: ['categoria']
    });
  }

  async findOne(id: string, user: UserActiveInterface) {
    const gasto = await this.gastoRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['categoria']
    });
    if (!gasto) {
      throw new NotFoundException(`No se encontro el id: ${id}`);
    }
    return gasto;
  }

  async update(id: string, updateGastoDto: UpdateGastoDto,user: UserActiveInterface) {
/*   const gasto = await this.gastoRepository.findOne({
    where: { id },
    relations: ['categoria'], // solo cargamos la categoría si se va a actualizar
  }); */
  const gastoExistente = await this.findOne(id, user)

  const {categoriaID, ...toUpdate} = updateGastoDto;

  let gasto = await this.gastoRepository.preload({
    id: gastoExistente.id,
    ...toUpdate,
  })

  if(!gasto){
    gasto = gastoExistente
  }

  if(categoriaID){
    const categoria = await this.categoriaRepository.findOneBy({id: categoriaID});
    if(!categoria) throw new NotFoundException('Categoria no encontrada');
    gasto.categoria = categoria;
  }

  // if (!gasto) throw new NotFoundException(`Gasto con id ${id} no encontrado`);

  // // Actualizamos la categoría solo si se manda
  // if (updateGastoDto.categoriaID) {
  //   const categoria = await this.categoriaRepository.findOneBy({ id: updateGastoDto.categoriaID });
  //   if (!categoria) throw new NotFoundException('Categoría no encontrada');
  //   gasto.categoria = categoria;
  // }
  return await this.gastoRepository.save(gasto);
}

  async remove(id: string, user: UserActiveInterface) {
    const gasto = await this.findOne(id, user);
    await this.gastoRepository.remove(gasto);
    return 'Gasto eliminado';
  }
}
