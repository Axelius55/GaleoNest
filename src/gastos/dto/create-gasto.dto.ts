import { IsDate, IsDateString, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateGastoDto {
  @IsString()
  @MinLength(1)
  nombreGasto: string;

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
  @IsDateString()
  fechaGasto: Date;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUUID()
  usuarioID: string;    // referencia
  @IsUUID()
  categoriaID: string;  // referencia
}
