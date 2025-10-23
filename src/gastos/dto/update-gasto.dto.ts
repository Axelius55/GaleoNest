import { PartialType } from '@nestjs/mapped-types';
import { CreateGastoDto } from './create-gasto.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateGastoDto extends PartialType(CreateGastoDto) {
    @IsUUID()
    @IsOptional()
    usuarioID?: string

    @IsUUID()
    @IsOptional()
    categoriaID?: string
}
