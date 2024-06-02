import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from './pokemon/pokemon.module';
import { Pokemon } from './pokemon/entities/pokemon.entity';
import { StatsModule } from './stats/stats.module';
import { Stat } from './stats/entities/stat.entity';
import { AbilitiesModule } from './abilities/abilities.module';
import { TypesModule } from './types/types.module';
import { Ability } from './abilities/entities/ability.entity';
import { Type } from './types/entities/type.entity';
import { PokemonAbilities } from './pokemon/entities/pokemon_abilities.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: [Pokemon, Stat, Ability, Type, PokemonAbilities],
      synchronize: true,
    }),
    PokemonModule,
    StatsModule,
    AbilitiesModule,
    TypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
