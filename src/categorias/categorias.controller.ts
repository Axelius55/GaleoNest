import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decoratot';
import { Role } from 'src/common/enums/rol.enum';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) { }

  @Post()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  @Auth(Role.USER)
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  @Auth(Role.USER)
  @ApiOperation({ summary: 'Obtener una categoría por su ID' })
  findOne(@Param('id') id: string) {
    return this.categoriasService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar una categoría por su ID' })
  update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar una categoría por su ID al eliminar una categoria asociada a gastos, en gastos la categoria quedara en null' })
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(id);
  }
}
