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
import { APIResponse, PokemonDetails, PokemonSpecieInfo } from 'src/interfaces';
import { Stat } from 'src/stats/entities/stat.entity';

interface PokemonResult {
  name: string;
  url: string;
}

interface SpecieDetails {
  name: string;
  description: string;
  class: string
}

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);

  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
    @InjectRepository(Stat)
    private readonly statRepository: Repository<Stat>,
    private readonly httpService: HttpService,
  ) {}

  private pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=3';



  
  private async fetchPokemonSpeciesDetails(url: string): Promise<SpecieDetails> {
    const { data: specieData} = await firstValueFrom(
      this.httpService.get<PokemonSpecieInfo>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    const pokeName = specieData.names.find((name) => name.language.name === 'es');
    const pokeClass = specieData.genera.filter((genus) => (genus.language.name === 'es')).pop();
    const pokeDescription = specieData.flavor_text_entries.filter((desc) => desc.language.name === 'es').pop();
  
    const data = {
      description: pokeDescription.flavor_text,
      class: pokeClass.genus,
      name: pokeName.name
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
    
    // Save Pokemon Data
    const pokemon = new Pokemon();
    pokemon.name = specieDetails.name;
    pokemon.weight = pokemonData.weight;
    pokemon.height = pokemonData.height;
    pokemon.description = specieDetails.description;
    pokemon.class = specieDetails.class;
    pokemon.image_url = pokemonData.sprites.other['official-artwork'].front_default;
    pokemon.cry_url = pokemonData.cries.latest;
    await this.pokemonRepository.save(pokemon);

    // Save stats for current pokemon
    const pokemonStat = new Stat();
    pokemonData.stats.map((stat) => {
      const statName = stat.stat.name.replace('-', '_');
      pokemonStat[statName] = stat.base_stat;
    });
    pokemonStat.pokemon = pokemon;
    await this.statRepository.save(pokemonStat);

    // pokemon.sprites = pokemonData.sprites;
    // pokemon.types = await this.fetchPokemonTypes(pokemonData.types);

    return pokemon;
  }

  fetchAllPokemon(): Observable<PokemonResult[]> {
    return this.httpService.get(this.pokeApiUrl)
      .pipe(
        map((response: AxiosResponse) => response.data.results),
        map((pokemons: any[]) =>
          pokemons.map((pokemon) => ({ name: pokemon.name, url: pokemon.url }))
        ),
        catchError((error) => throwError(() => new Error(error))),
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
