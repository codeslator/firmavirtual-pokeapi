import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AbilitiesService } from 'src/abilities/abilities.service';
import { TypesService } from 'src/types/types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Type } from 'src/types/entities/type.entity';
import { Stat } from 'src/stats/entities/stat.entity';
import { Ability } from 'src/abilities/entities/ability.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [SeedController],
  imports: [TypeOrmModule.forFeature([Pokemon, Type, Stat, Ability]), HttpModule],
  providers: [SeedService, PokemonService, AbilitiesService, TypesService],
})
export class SeedModule {}
