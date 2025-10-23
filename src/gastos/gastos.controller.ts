import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interface/user-active.interface';

@Auth(Role.USER)
@ApiBearerAuth()
@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo gasto asociado a un usuario y una categoría' })
  create(@Body() createGastoDto: CreateGastoDto, @ActiveUser() user: UserActiveInterface) {
    return this.gastosService.create(createGastoDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los gastos' })
  findAll(@ActiveUser() user: UserActiveInterface) {
    return this.gastosService.findAll(user);
  }
  //TODO. poner paginación
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un gasto por su ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @ActiveUser() user: UserActiveInterface) {
    return this.gastosService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un gasto por su ID, se puede actualizar la categoria pero no el usuario' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateGastoDto: UpdateGastoDto, @ActiveUser() user: UserActiveInterface) {
    return this.gastosService.update(id, updateGastoDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un gasto por su ID' })
  remove(@Param('id', ParseUUIDPipe) id: string, @ActiveUser() user: UserActiveInterface) {
    return this.gastosService.remove(id, user);
  }
}
