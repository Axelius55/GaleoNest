import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Presupuesto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'float', nullable: false})
    cantidad: number;
}
