import { Controller, Get, Param } from '@nestjs/common';
import { TypesService } from './types.service';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) { }

  @Get('/fetch')
  async fetchAll() {
    const types = await this.typesService.fetchPokemonTypes();
    return types;
  }

  @Get()
  findAll() {
    return this.typesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typesService.findOne(+id);
  }
}
