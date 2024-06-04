import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pokemon_abilities' })
export class PokemonAbilities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  is_hidden: boolean;

}
