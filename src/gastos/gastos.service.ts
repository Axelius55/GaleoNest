import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,
    private readonly commonService: CommonService,
  ){}

  async create(createGastoDto: CreateGastoDto) {
    try {
      return await this.gastoRepository.save(createGastoDto);
    } catch (error) {
      this.commonService.handleDBExceptions(error);
    }
  }
  //TODO: poner paginación
  findAll() {
   return this.gastoRepository.find();
  }

  async findOne(id: string) {
    const gasto = await this.gastoRepository.findOneBy({id})
    if(!gasto){
      throw new NotFoundException(`No se encontro el id: ${id}`)
    }
    return gasto;
  }

  async update(id: string, updateGastoDto: UpdateGastoDto) {
    const updateGasto = await this.gastoRepository.preload({id, ...updateGastoDto});
    if(!updateGasto){
      throw new NotFoundException(`No se encontro el id: ${id}`);
    }
    await this.gastoRepository.save(updateGasto);
    return updateGasto;
  }

  async remove(id: string) {
    const gasto = await this.findOne(id);
    await this.gastoRepository.remove(gasto)
    return "Gasto eliminado";
  }
}
