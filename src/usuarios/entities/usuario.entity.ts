import { Gasto } from "src/gastos/entities/gasto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {nullable: false})
    nombre: string;

    @Column('text', { unique: true, nullable: false })
    correo: string;

    @Column('text', { unique: true, select: false })
    contrasena: string;

    //TODO: UNO A MUCHOS CON GASTOS
    @OneToMany(() => Gasto, (gasto) => gasto.usuarioID )
    gasto: Gasto[];

}