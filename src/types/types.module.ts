import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from './entities/type.entity';

@Module({
  controllers: [TypesController],
  imports: [HttpModule, TypeOrmModule.forFeature([Type])],
  providers: [TypesService],
})
export class TypesModule {}
