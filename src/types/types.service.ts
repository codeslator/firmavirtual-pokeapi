import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Type } from './entities/type.entity';
import { APIResponse, PokemonTypeDetails, TypeDetails } from 'src/interfaces';


@Injectable()
export class TypesService {
  private readonly logger = new Logger(TypesService.name);

  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
    private readonly httpService: HttpService,
  ) {}

  private pokeApiUrl = 'https://pokeapi.co/api/v2/type';


  async fetchTypesDetails(url: string): Promise<TypeDetails> {
    const { data: typeData } = await lastValueFrom(
      this.httpService.get<PokemonTypeDetails>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    
    const type = typeData.names.find((name) => name.language.name === 'es');
    const typeDetails: TypeDetails = {
      name: type.name,
    }

    return typeDetails;
  }

  // Service to seed pokemon types
  async fetchPokemonTypes(): Promise<Type[]> {
    const types = [];
    const { data: typeData} = await lastValueFrom(
      this.httpService.get<APIResponse>(this.pokeApiUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    for (const type of typeData.results) {
        const typeDetails = await this.fetchTypesDetails(type.url)
        const newType = new Type();
        newType.name = typeDetails.name;
        newType.key = type.name;
        types.push(await this.typeRepository.save(newType));
    }
    return types;
  }

  findAll() {
    return this.typeRepository.find();
  }

  findOne(id: number) {
    return this.typeRepository.findOneBy({ id });
  }
}
