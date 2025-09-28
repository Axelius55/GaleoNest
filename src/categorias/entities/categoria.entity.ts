import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: "text", nullable: false})
    nombreCategoria: string;

    // UNO A MUCHOS CON GASTOS
}
