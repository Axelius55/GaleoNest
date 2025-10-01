import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { CommonService } from 'src/common/common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Presupuesto } from './entities/presupuesto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PresupuestosService {
  constructor(
    @InjectRepository(Presupuesto)
    private readonly presupuestoRepository: Repository<Presupuesto>,
    private readonly commoService: CommonService,
  ) {}

  async create(createPresupuestoDto: CreatePresupuestoDto) {
    try {
      return await this.presupuestoRepository.save(createPresupuestoDto);
    } catch (error) {
      this.commoService.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.presupuestoRepository.find();
  }

  async findOne(id: string) {
    const presupuesto = await this.presupuestoRepository.findOneBy({id})
    if(!presupuesto) throw new NotFoundException(`El id: ${id} no se encontro`)
    return presupuesto;
  }

  async update(id: string, updatePresupuestoDto: UpdatePresupuestoDto) {
    const updatePresu = await this.presupuestoRepository.preload({
      id,
      ...updatePresupuestoDto
    });

    if(!updatePresu) throw new NotFoundException(`El id: ${id} no se encontro`);

    await this.presupuestoRepository.save(updatePresu);
    return updatePresu;
  }

  async remove(id: string) {
    const presupuesto = await this.findOne(id);
    await this.presupuestoRepository.remove(presupuesto);
    return "presupuesto eliminado";
  }
}
