import { Injectable, Logger } from '@nestjs/common';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';
import { Ability } from './entities/ability.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { APIResponse } from 'src/interfaces';

@Injectable()
export class AbilitiesService {
  private readonly logger = new Logger(AbilitiesService.name);

  constructor(
    @InjectRepository(Ability)
    private readonly abilitiesRepository: Repository<Ability>,
    private readonly httpService: HttpService,
  ) {}

  private pokeApiUrl = 'https://pokeapi.co/api/v2/ability?limit=367';


  async fetchPokemonAbilities(): Promise<Ability[]> {
    const abilities = [];
    const { data: abilitiesData} = await lastValueFrom(
      this.httpService.get<APIResponse>(this.pokeApiUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    )
    for (const ability of abilitiesData.results) {
        const newAbility = new Ability();
        newAbility.name = ability.name;
        abilities.push(await this.abilitiesRepository.save(newAbility));
    }
    return abilities;
  }



  create(createAbilityDto: CreateAbilityDto) {
    return 'This action adds a new ability';
  }

  findAll() {
    return `This action returns all abilities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ability`;
  }

  update(id: number, updateAbilityDto: UpdateAbilityDto) {
    return `This action updates a #${id} ability`;
  }

  remove(id: number) {
    return `This action removes a #${id} ability`;
  }
}
