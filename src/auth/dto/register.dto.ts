import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer"
import { IsEmail, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class RegisterDto{
    @ApiProperty({example: "Oviedo", description: 'Nombre del usuario', required: true})
    @IsString()
    @MinLength(1)
    nombre: string;

    @IsEmail()
    @ApiProperty({example: "oviedo@gmail.com", description: 'Correo electronico valido del usuario', required: true})
    correo: string;

    @IsString()
    @ApiProperty({example: "123456789", description: 'Contraseña del usuario de minimo 5 caracteres', required: true})
    @MinLength(5)
    @Transform(({value}) => value.trim())
    contrasena: string

    @ApiProperty({example: 1500.50, description: 'Presupuesto inicial del usuario', required: false})
    @IsNumber({maxDecimalPlaces: 3})
    @IsOptional()
    @IsPositive()
    presupuesto?: number;
    
    @IsString({each: true})
    @IsOptional()
    images?: string[];

}