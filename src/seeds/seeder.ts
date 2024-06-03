import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PokemonService } from '../pokemon/pokemon.service';
import { PokemonModule } from 'src/pokemon/pokemon.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext([AppModule, PokemonModule]);
  const pokemonService = app.get(PokemonService);

  await pokemonService.fetchAllPokemon()

  // const pokemonNames = ['pikachu', 'bulbasaur', 'charmander']; // Añade más nombres de Pokémon según sea necesario

  // for (const name of pokemonNames) {
  //   try {
  //     await pokemonService.fetchAndSavePokemonData(name);
  //     console.log(`Seeded ${name}`);
  //   } catch (error) {
  //     console.error(`Failed to seed ${name}:`, error);
  //   }
  // }

  await app.close();
}

bootstrap();
