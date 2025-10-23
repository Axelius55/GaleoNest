import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Res,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
// import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './entities/helpers/fileFilter.helper';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { Auth } from '../common/decorators/auth.decoratot';
import { Role } from '../common/enums/rol.enum';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interface/user-active.interface';


@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Auth(Role.USER)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  create(@Body() registerDto: RegisterDto) {
    return this.usuariosService.create(registerDto);
  }
  //TODO. poner paginacion
  @Auth(Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios, llegarán tambien sus gastos',
  })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Auth(Role.USER)
  @Get('photo/:imageName')
  findOneImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.usuariosService.getStaticProductImage(imageName);

    res.sendFile(path);
  }

  @Auth(Role.USER)
  @Post('photo')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: memoryStorage(),
    }),
  )
  uploadProducImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.usuariosService.saveFile(file);
  }

  @Auth(Role.USER)
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un usuario por su ID, llegará tambien con sus gastos',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.findOne(id);
  }

  @Auth(Role.USER)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por su ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @ActiveUser() user: UserActiveInterface
  ) {
    return this.usuariosService.update(id, updateUsuarioDto, user);
  }

  @Auth(Role.USER)
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un usuario por su ID, se eliminarán también sus gastos',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.remove(id);
  }
}
