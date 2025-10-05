import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo gasto asociado a un usuario y una categoría' })
  create(@Body() createGastoDto: CreateGastoDto) {
    return this.gastosService.create(createGastoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los gastos' })
  findAll() {
    return this.gastosService.findAll();
  }
  //TODO. poner paginación
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un gasto por su ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.gastosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un gasto por su ID, se puede actualizar la categoria pero no el usuario' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateGastoDto: UpdateGastoDto) {
    return this.gastosService.update(id, updateGastoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un gasto por su ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.gastosService.remove(id);
  }
}
