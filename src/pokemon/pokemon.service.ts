import { Injectable, Logger } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { Repository } from 'typeorm';
import { Observable, catchError, firstValueFrom, lastValueFrom, map, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { Type } from 'src/types/entities/type.entity';
import { PokemonDetails, PokemonSpecieInfo } from 'src/interfaces';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);

  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
    private readonly httpService: HttpService,
  ) {}

  private pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=1025';



  
  private async fetchPokemonSpeciesDetails(url: string): Promise<{ description: string; class: string }> {
    const { data: specieData} = await firstValueFrom(
      this.httpService.get<PokemonSpecieInfo>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    const pokeClass = specieData.genera.filter((genus) => (genus.language.name === 'es')).pop();
    const pokeDescription = specieData.flavor_text_entries.filter((desc) => desc.language.name === 'es').pop();
  
    const data = {
      description: pokeDescription.flavor_text,
      class: pokeClass.genus
    }
    return data;
  }
  

  async fetchPokemonDetails(url: string): Promise<Pokemon> {
    const { data: pokemonData } = await lastValueFrom(
      this.httpService.get<PokemonDetails>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    const specieDetails = await this.fetchPokemonSpeciesDetails(pokemonData.species.url)

    const pokemon = new Pokemon();
    pokemon.name = pokemonData.name;
    pokemon.weight = pokemonData.weight;
    pokemon.height = pokemonData.height;
    pokemon.description = specieDetails.description;
    pokemon.class = specieDetails.class;
    pokemon.image_url = pokemonData.sprites['official-artwork'].front_default;
    pokemon.cry_url = pokemonData.cries.latest;

    // pokemon.stats = pokemonData.stats.map((stat) => ({
    //   name: stat.stat.name,
    //   value: stat.base_stat,
    // }));
    // pokemon.sprites = pokemonData.sprites;
    // pokemon.types = await this.fetchPokemonTypes(pokemonData.types);

    return pokemon;
  }

  fetchAllPokemon(): Observable<{ name: string }[]> {
    return this.httpService.get(this.pokeApiUrl)
      .pipe(
        map((response: AxiosResponse) => response.data.results),
        map((pokemons: any[]) =>
          pokemons.map((pokemon) => ({ name: pokemon.name }))
        ),
        catchError((error) => throwError(error)),
      );
  }

  // async savePokemons(pokemons: Pokemon[]): Promise<void> {
  //   for (const pokemon of pokemons) {
  //     await this.pokemonRepository.save(pokemon);
  //   }
  // }

  create(createPokemonDto: CreatePokemonDto) {
    return 'This action adds a new pokemon';
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
