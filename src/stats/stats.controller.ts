import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  findAll() {
    return this.statsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statsService.findOne(+id);
  }
}
