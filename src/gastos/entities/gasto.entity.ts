import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gasto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {nullable: false})
    nombreGasto: string;

    @Column({type: "float"})
    monto: number;

    @Column({type: "date", nullable: false})
    fechaGasto: Date;

    @Column('text', { nullable: true})
    descripcion?: string

    //TODO: MUCHOS A UNO CON USUARIOS


    //TODO: UNO A MUCHOS CON CATEGORÍAS
}
