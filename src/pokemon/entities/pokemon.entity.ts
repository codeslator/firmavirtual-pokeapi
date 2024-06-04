import { Ability } from 'src/abilities/entities/ability.entity';
import { Type } from 'src/types/entities/type.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Pokemon {

  @PrimaryGeneratedColumn()
  id: number;


  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  class: string;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'int' })
  weight: number;

  @Column({ type: 'varchar', length: 255 })
  image_url: string;

  @Column({ type: 'varchar', length: 255 })
  cry_url: string;

  @ManyToMany(() => Ability)
  @JoinTable({ 
    name: 'pokemon_abilities', 
    joinColumn: {
      name: "pokemon_id",
      referencedColumnName: "id"
    }, 
    inverseJoinColumn: {
      name: "ability_id",
      referencedColumnName: "id"
    }})
    abilities: Ability[];


  @ManyToMany(() => Type)
  @JoinTable({ 
    name: 'pokemon_types', 
    joinColumn: {
      name: "pokemon_id",
      referencedColumnName: "id"
    }, 
    inverseJoinColumn: {
      name: "type_id",
      referencedColumnName: "id"
    }})
  types: Type[];
}
