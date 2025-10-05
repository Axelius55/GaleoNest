import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateCategoriaDto {
    @ApiProperty({ example: 'Entretenimiento', description: 'Nombre de la categoría', minLength: 1 })
    @IsString()
    @MinLength(1)
    nombreCategoria: string;
}
