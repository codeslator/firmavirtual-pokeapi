import { Module } from '@nestjs/common';
import { AbilitiesService } from './abilities.service';
import { AbilitiesController } from './abilities.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ability } from './entities/ability.entity';

@Module({
  controllers: [AbilitiesController],
  imports: [HttpModule, TypeOrmModule.forFeature([Ability])],
  providers: [AbilitiesService],
})
export class AbilitiesModule {}
