import { IsNumber, IsPositive } from "class-validator";

export class CreatePresupuestoDto {
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    cantidad: number;
}
