import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AbilitiesService } from 'src/abilities/abilities.service';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { TypesService } from 'src/types/types.service';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly pokemonService: PokemonService,
    private readonly abilitiesService: AbilitiesService,
    private readonly typesService: TypesService
  ) {}
  

  async seed(): Promise<string> {
    const tables = ['pokemon_abilities', 'pokemon_types', 'pokemon', 'abilities', 'types', 'stats'];

    let queryRunner: QueryRunner;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.startTransaction();

      for (const tableName of tables) {
        await queryRunner.query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
      }
      await queryRunner.commitTransaction();
      console.log('Tables truncated and sequences reset successfully.');
    } catch (error) {
      console.error('Error truncating and resetting tables:', error);
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
      }
      throw error; // Re-throw for proper error handling
    } finally {
      // Always release the query runner
      if (queryRunner) {
        await queryRunner.release();
      }
    }

    console.log('Seeding Pokemon Types...');
    await this.typesService.fetchPokemonTypes();
    console.log('Pokemon Types seeded successfully!');

    console.log('Seeding Pokemon Abilities...');
    await this.abilitiesService.fetchPokemonAbilities();
    console.log('Pokemon Abilities seeded successfully!');

    const pokemonList = await lastValueFrom(this.pokemonService.fetchAllPokemon());

    console.log('Pokemon seeding. it may takes some minutes, please be patient... There are 1025 species (not including forms)');
    for (const pokemon of pokemonList) {
      await this.pokemonService.fetchPokemonDetails(pokemon.url);
    }
    console.log('Pokemon seeded successfully!');
    
    return 'All tables seed successfully!'
  }
}
