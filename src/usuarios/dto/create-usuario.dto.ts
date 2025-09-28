import { Transform } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @IsEmail()
    @MaxLength(25)
    correo: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    contrasena: string;

}
