import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {nullable: false})
    nombre: string;

    @Column('text', { unique: true, nullable: false })
    correo: string;

    @Column('text', { unique: true, nullable: false, select: false })
    contraseña: string;

    // UNO A UNO CON PRESUPUESTOS


    // UNO A MUCHOS CON GASTOS
}