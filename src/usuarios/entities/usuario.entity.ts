import { Role } from "src/common/enums/rol.enum";
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

    @Column('text', { select: false })
    contrasena: string;

    @OneToMany(() => Gasto, (gasto) => gasto.usuario,)
    gasto: Gasto[];

    @Column({type: 'float', nullable: true})
    presupuesto?: number;

    @Column({ type: 'enum', default: Role.USER, enum: Role })
    rol: string;

    @Column('text', {nullable: true})
    urlImage: string;

}