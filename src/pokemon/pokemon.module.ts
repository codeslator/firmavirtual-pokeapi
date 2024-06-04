import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { Type } from 'src/types/entities/type.entity';
import { Stat } from 'src/stats/entities/stat.entity';
import { Ability } from 'src/abilities/entities/ability.entity';

@Module({
  controllers: [PokemonController],
  imports: [HttpModule, TypeOrmModule.forFeature([Pokemon, Type, Stat, Ability])],
  providers: [PokemonService],
})
export class PokemonModule {}
