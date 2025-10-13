import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto{
    @IsEmail()
    correo: string;

    @IsString()
    @MinLength(5)
    @Transform(({ value }) => value.trim())
    contrasena: string
}