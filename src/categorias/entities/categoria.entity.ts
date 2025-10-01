import { Gasto } from "src/gastos/entities/gasto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: "text", nullable: false})
    nombreCategoria: string;

    //TODO: UNO A MUCHOS CON GASTOS
    @OneToMany(() => Gasto, (gasto) => gasto.categoriaID)
    gasto: Gasto[];
}
