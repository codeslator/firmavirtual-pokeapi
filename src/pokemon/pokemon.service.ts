import { Injectable, Logger } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { Observable, catchError, firstValueFrom, lastValueFrom, map, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { Type } from 'src/types/entities/type.entity';
import { PokemonAbility, PokemonDetails, PokemonResult, PokemonSpecieInfo, PokemonType, SpecieDetails } from 'src/interfaces';
import { Stat } from 'src/stats/entities/stat.entity';
import { Ability } from 'src/abilities/entities/ability.entity';
import { Repository } from 'typeorm';
import { getPreferredLanguageObject } from 'src/interfaces/functions';

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
    @InjectRepository(Ability)
    private readonly abilityRepository: Repository<Ability>,
    private readonly httpService: HttpService,
  ) { }

  private pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=1025';

  private async fetchPokemonSpeciesDetails(url: string): Promise<SpecieDetails> {
    const { data: specieData } = await firstValueFrom(
      this.httpService.get<PokemonSpecieInfo>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    const pokeName = specieData.names.find((name) => name.language.name === 'es');
    const pokeDescription = getPreferredLanguageObject(specieData.flavor_text_entries);
    const pokeClass = getPreferredLanguageObject(specieData.genera);

    const data = {
      description: pokeDescription.flavor_text,
      class: pokeClass.genus,
      name: pokeName.name
    }
    return data;
  }

  private async getPokemonTypes(types: PokemonType[]): Promise<Type[]> {
    const pokemonTypes = [];
    for (const type of types) {
      const foundType = await this.typeRepository.findOne({ where: { key: type.type.name } });
      if (foundType) {
        pokemonTypes.push(foundType);
      }
    }
    return pokemonTypes;
  }

  private async getPokemonAbilities(abilities: PokemonAbility[]): Promise<Ability[]> {
    const pokemonAbilities = [];
    // ? POKEAPI HAS SOME DUPLICATES ABILITIES IN A POKEMON, THIS REMOVES DUPLICATES, SEE POKEMON 948
    for (const ability of abilities.filter((item, index) => abilities.findIndex((elem) => item.ability.name === elem.ability.name) === index)) {
      const foundAbility = await this.abilityRepository.findOne({ where: { key: ability.ability.name } });
      if (foundAbility) {
        pokemonAbilities.push(foundAbility);
      }
    }
    return pokemonAbilities;
  }

  private async savePokemon(pokemonData: PokemonDetails): Promise<Pokemon> {
    const specieDetails = await this.fetchPokemonSpeciesDetails(pokemonData.species.url)

    const pokemon = new Pokemon();
    pokemon.name = specieDetails.name;
    pokemon.weight = pokemonData.weight;
    pokemon.height = pokemonData.height;
    pokemon.description = specieDetails.description.replace('\n', ' ');
    pokemon.class = specieDetails.class;
    pokemon.image_url = pokemonData.sprites.other['official-artwork'].front_default;
    pokemon.cry_url = pokemonData.cries.latest;
    pokemon.types = await this.getPokemonTypes(pokemonData.types);
    pokemon.abilities = await this.getPokemonAbilities(pokemonData.abilities);
    await this.pokemonRepository.save(pokemon);

    // Save stats for current pokemon
    const pokemonStat = new Stat();
    pokemonData.stats.map((stat) => {
      const statName = stat.stat.name.replace('-', '_');
      pokemonStat[statName] = stat.base_stat;
    });
    pokemonStat.pokemon = pokemon;
    await this.statRepository.save(pokemonStat);

    return pokemon;
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

    const pokemon = this.savePokemon(pokemonData);
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

  create(createPokemonDto: CreatePokemonDto) {
    return 'This action adds a new pokemon';
  }

  findAll() {
    return this.pokemonRepository.find();
  }

  findOne(id: number) {
    const pokemon = this.pokemonRepository.findOne({
      where: { id },
      relations: {
        types: true,
        abilities: true,
        stats: true,
      }
    });
    if (!pokemon) {
      return null;
    }
    return pokemon;
  }

  async findPaginatedAndFiltered(
    page: number,
    limit: number,
    filter: string,
    search: string,
    sort?: string,
    order?: { [key: string]: 'ASC' | 'DESC' } | { [key: string]: string }
  ): Promise<{ results: Pokemon[], count: number }> {
    const offset = (page - 1) * limit;
    let ordering = undefined; // Define ordering flag variable
    let filtering = undefined; // Define filtering flag variable
    if (sort) { // If has an specific sort
      ordering = order;
      if (sort.includes('.')) {
        const [relation, column] = sort.split('.');
        sort = relation;
        ordering = {
          [column]: order,
        }
      }
    }
    if (filter) { // If has a specific filter
      filtering = search;
      if (filter.includes('.')) {
        const [relation, column] = filter.split('.');
        filter = relation;
        filtering = {
          [column]: search,
        }
      }
    }
    const [results, total] = await this.pokemonRepository.findAndCount({
      order: { [sort]: ordering },
      where: { [filter]: filtering },
      take: limit,
      skip: offset,
      relations: {
        stats: true,
        types: true,
        abilities: true,
      },

    });

    return { results, count: total };
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
