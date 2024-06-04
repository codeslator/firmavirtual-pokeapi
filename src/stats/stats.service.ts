import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {

  findAll() {
    return `This action returns all stats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stat`;
  }
}
