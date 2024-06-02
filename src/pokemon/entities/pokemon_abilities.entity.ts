import { Entity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { Ability } from 'src/abilities/entities/ability.entity';

@Entity({ name: 'pokemon_abilities' })
export class PokemonAbilities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  is_hidden: boolean;


  @OneToOne(() => Pokemon)
  @JoinColumn({ name: 'pokemon_id' })
  pokemon: Pokemon;

  @OneToOne(() => Ability)
  @JoinColumn({ name: 'ability_id' })
  ability: Ability;
}
