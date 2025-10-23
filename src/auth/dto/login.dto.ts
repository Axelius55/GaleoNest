import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto{
    @IsEmail()
    @ApiProperty({example: "correo@gmail.com", description: 'correo registrado del usuario', required: true})
    correo: string;

    @ApiProperty({example: "123456789", description: 'contrasena del usuario', required: true})
    @IsString()
    @MinLength(5)
    @Transform(({ value }) => value.trim())
    contrasena: string
}