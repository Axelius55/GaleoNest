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

    @ManyToOne(() => Usuario, (usuario) => usuario.gasto,{
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: "UsuarioID"})
    usuario: Usuario;

    @ManyToOne(() => Categoria, (categoria) => categoria.gasto, {
        nullable: true,
        onDelete: 'SET NULL',
        eager: true,
    })
    @JoinColumn({name: "CategoriaID"})
    categoria: Categoria;
}
