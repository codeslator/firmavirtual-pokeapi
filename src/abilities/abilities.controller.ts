import { Controller, Get, Param } from '@nestjs/common';
import { AbilitiesService } from './abilities.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Abilities')
@Controller('abilities')
export class AbilitiesController {
  constructor(private readonly abilitiesService: AbilitiesService) {}

  @Get('fetch')
  async fetchAll() {
    const abilities = await this.abilitiesService.fetchPokemonAbilities();
    return abilities;
  }

  @Get()
  findAll() {
    return this.abilitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abilitiesService.findOne(+id);
  }
}
