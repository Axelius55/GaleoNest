import { Transform } from "class-transformer"
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto{
    @IsString()
    @MinLength(1)
    nombre: string;

    @IsEmail()
    correo: string;

    @IsString()
    @MinLength(5)
    @Transform(({value}) => value.trim())
    contrasena: string

}