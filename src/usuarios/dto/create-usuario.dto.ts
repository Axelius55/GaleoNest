import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsEmail, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {
    @ApiProperty({ example: 'Juan Perez', description: 'Nombre completo del usuario', minLength: 1})
    @IsString()
    @MinLength(1)
    @Transform(({ value }) => value.trim())
    nombre: string;

    @ApiProperty({example: 'holaquetal@gmail.com', description: 'Correo electrónico del usuario', maxLength: 25})
    @IsString()
    @IsEmail()
    @MaxLength(25)
    correo: string;

    @ApiProperty({example: 'MiContrasena123', description: 'Contraseña del usuario' + ' (mínimo 5 caracteres y máximo 20 caracteres)', minLength: 5, maxLength: 20})
    @MinLength(5)
    @MaxLength(20)
    @Transform(({ value }) => value.trim())
    @IsString()
    contrasena: string;

    @ApiProperty({example: 1500.50, description: 'Presupuesto inicial del usuario', required: false})
    @IsNumber({maxDecimalPlaces: 3})
    @IsPositive()
    presupuesto?: number;

    @IsString({each: true})
    @IsOptional()
    images?: string[];
}
