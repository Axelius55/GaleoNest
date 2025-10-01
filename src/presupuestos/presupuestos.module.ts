import { Module } from '@nestjs/common';
import { PresupuestosService } from './presupuestos.service';
import { PresupuestosController } from './presupuestos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presupuesto } from './entities/presupuesto.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Presupuesto]), CommonModule],
  controllers: [PresupuestosController],
  providers: [PresupuestosService],
})
export class PresupuestosModule {}
