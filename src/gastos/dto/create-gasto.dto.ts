import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateGastoDto {
  @ApiProperty({ example: 'Compra en supermercado', description: 'Nombre o título del gasto', minLength: 1 })
  @IsString()
  @MinLength(1)
  nombreGasto: string;

  @ApiProperty({ example: 250.75, description: 'Monto del gasto', minimum: 0.01, maximum: 1000000, type: 'number' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto: number;


  //validos 
  //"2025-09-27"
  //"2025-09-27T18:00:00Z"
  //"2025-09-27T18:00:00+00:00"

  //Invalidos
  //"27/09/2025"
  //"2025-99-99"
  //new Date() (objeto Date)
  @ApiProperty({ example: '2025-09-27 o "2025-09-27T18:00:00Z" o "2025-09-27T18:00:00+00:00"', description: 'Fecha del gasto en formato ISO 8601 (YYYY-MM-DD)' })
  @IsDateString()
  fechaGasto: Date;

  @ApiProperty({ example: 'Gasto realizado en el supermercado local', description: 'Descripción opcional del gasto', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  // @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890 Un usuario no se puede actualizar, si se manda otro ID se va a ignorar', description: 'ID del usuario que realiza el gasto' })
  // @IsUUID()
  // usuarioID: string;    // referencia

  @ApiProperty({ example: 'b1c2d3e4-f5a6-7890-bcde-fa1234567890 La categoría se se manda si puede cambiar', description: 'ID de la categoría del gasto' })
  @IsUUID()
  categoriaID: string;  // referencia
}
