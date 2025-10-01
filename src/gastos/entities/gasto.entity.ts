import { Categoria } from "src/categorias/entities/categoria.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
    @ManyToOne(() => Usuario, (usuario) => usuario.gasto)
    @JoinColumn({name: "UsuarioID"})
    usuarioID: Usuario;

    //TODO: UNO A MUCHOS CON CATEGORÍAS
    @ManyToOne(() => Categoria, (categoria) => categoria.gasto)
    @JoinColumn({name: "CategoriaID"})
    categoriaID: Categoria;
}
