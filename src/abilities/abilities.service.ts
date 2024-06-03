import { Injectable, Logger } from '@nestjs/common';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';
import { Ability } from './entities/ability.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { APIResponse, PokemonAbilityDetails } from 'src/interfaces';

interface AbilityDetails {
  name: string;
}

@Injectable()
export class AbilitiesService {
  private readonly logger = new Logger(AbilitiesService.name);

  constructor(
    @InjectRepository(Ability)
    private readonly abilitiesRepository: Repository<Ability>,
    private readonly httpService: HttpService,
  ) { }

  private pokeApiUrl = 'https://pokeapi.co/api/v2/ability?limit=367';


  async fetctAbilityDetails(url: string): Promise<AbilityDetails> {
    const { data: abilityData } = await lastValueFrom(
      this.httpService.get<PokemonAbilityDetails>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    // Priorize if name is Spanish first or English them
    const isSpanishOrEnglish = (languageName) => languageName === 'es' || languageName === 'en';   
    // Filter all abilities and get value first in spanish if exists and if not, get english value then 
    const abilityName = abilityData.names.filter((name) => {
      if (name.language!.name === "es" ) {
        return true;
      }
      if (name.language.name === "en") {
        return true;
      }
      return false;
    }).find((name) => isSpanishOrEnglish(name.language.name));
    const abilitiDetals: AbilityDetails = {
      name: abilityName.name,
    }

    return abilitiDetals;
  }

  async fetchPokemonAbilities(): Promise<Ability[]> {
    const abilities = [];
    const { data: abilitiesData } = await lastValueFrom(
      this.httpService.get<APIResponse>(this.pokeApiUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    for (const ability of abilitiesData.results) {
      const abilityDetails = await this.fetctAbilityDetails(ability.url);
      const newAbility = new Ability();
      newAbility.name = abilityDetails.name;
      abilities.push(await this.abilitiesRepository.save(newAbility));
      console.log(abilityDetails, newAbility.id)
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
