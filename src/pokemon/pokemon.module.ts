import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { Type } from 'src/types/entities/type.entity';

@Module({
  controllers: [PokemonController],
  imports: [HttpModule, TypeOrmModule.forFeature([Pokemon, Type])],
  providers: [PokemonService],
})
export class PokemonModule {}
