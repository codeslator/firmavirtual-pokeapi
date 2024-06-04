import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { lastValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }


  @Get()
  async getFilteredAndSortedData(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sort') sort?: string,
    @Query('order') order?: { [key: string]: 'ASC' | 'DESC' },
  ) {
    return await this.pokemonService.findPaginatedAndFiltered(page, limit, sort, order);
  }

  @Get('fetch')
  async fetchAll() {
    const pokemonList = await lastValueFrom(this.pokemonService.fetchAllPokemon());
    for (const pokemon of pokemonList) {
      await this.pokemonService.fetchPokemonDetails(pokemon.url);
    }
    return 'Done';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(+id, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(+id);
  }
}
