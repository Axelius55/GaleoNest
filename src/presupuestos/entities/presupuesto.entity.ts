import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Presupuesto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'float', nullable: false})
    cantidad: number;

    //TODO: UNO A UNO CON USUARIOS
    @OneToOne(() => Usuario)
    @JoinColumn({ name: "UsuarioID" })
    usuario: Usuario;

}  
