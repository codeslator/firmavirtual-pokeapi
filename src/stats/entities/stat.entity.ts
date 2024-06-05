import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'stats' })
export class Stat {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  hp: number;

  @Column({ type: 'int' })
  attack: number;

  @Column({ type: 'int' })
  defense: number;

  @Column({ type: 'int' })
  special_attack: number;

  @Column({ type: 'int' })
  special_defense: number;

  @Column({ type: 'int' })
  speed: number;
}
