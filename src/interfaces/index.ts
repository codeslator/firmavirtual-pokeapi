export interface PokemonDetails {
  abilities:                Ability[];
  cries:                    Cries;
  height:                   number;
  id:                       number;
  name:                     string;
  order:                    number;
  species:                  GenericData;
  sprites:                  Sprites;
  stats:                    Stat[];
  types:                    Type[];
  weight:                   number;
}

export interface Ability {
  ability:   GenericData;
  is_hidden: boolean;
  slot:      number;
}

export interface GenericData {
  name: string;
  url:  string;
}

export interface Cries {
  latest: string;
  legacy: string;
}



export interface GenerationV {
  "black-white": Sprites;
}

export interface GenerationIv {
  "diamond-pearl":        Sprites;
  "heartgold-soulsilver": Sprites;
  platinum:               Sprites;
}

export interface Versions {
  "generation-i":    GenerationI;
  "generation-ii":   GenerationIi;
  "generation-iii":  GenerationIii;
  "generation-iv":   GenerationIv;
  "generation-v":    GenerationV;
  "generation-vi":   { [key: string]: Home };
  "generation-vii":  GenerationVii;
  "generation-viii": GenerationViii;
}

export interface Other {
  dream_world:        DreamWorld;
  home:               Home;
  "official-artwork": OfficialArtwork;
  showdown:           Sprites;
}

export interface Sprites {
  back_default:       string;
  back_female:        null;
  back_shiny:         string;
  back_shiny_female:  null;
  front_default:      string;
  front_female:       null;
  front_shiny:        string;
  front_shiny_female: null;
  other?:             Other;
  versions?:          Versions;
  animated?:          Sprites;
}

export interface GenerationI {
  "red-blue": RedBlue;
  yellow:     RedBlue;
}

export interface RedBlue {
  back_default:      string;
  back_gray:         string;
  back_transparent:  string;
  front_default:     string;
  front_gray:        string;
  front_transparent: string;
}

export interface GenerationIi {
  crystal: Crystal;
  gold:    Gold;
  silver:  Gold;
}

export interface Crystal {
  back_default:            string;
  back_shiny:              string;
  back_shiny_transparent:  string;
  back_transparent:        string;
  front_default:           string;
  front_shiny:             string;
  front_shiny_transparent: string;
  front_transparent:       string;
}

export interface Gold {
  back_default:       string;
  back_shiny:         string;
  front_default:      string;
  front_shiny:        string;
  front_transparent?: string;
}

export interface GenerationIii {
  emerald:             OfficialArtwork;
  "firered-leafgreen": Gold;
  "ruby-sapphire":     Gold;
}

export interface OfficialArtwork {
  front_default: string;
  front_shiny:   string;
}

export interface Home {
  front_default:      string;
  front_female:       null;
  front_shiny:        string;
  front_shiny_female: null;
}

export interface GenerationVii {
  icons:                  DreamWorld;
  "ultra-sun-ultra-moon": Home;
}

export interface DreamWorld {
  front_default: string;
  front_female:  null;
}

export interface GenerationViii {
  icons: DreamWorld;
}

export interface Stat {
  base_stat: number;
  effort:    number;
  stat:      GenericData;
}

export interface Type {
  slot: number;
  type: GenericData;
}


export interface PokemonSpecieInfo {
  flavor_text_entries:    FlavorTextEntry[];
  genera:                 Genus[];
  id:                     number;
  is_baby:                boolean;
  is_legendary:           boolean;
  is_mythical:            boolean;
  name:                   string;
  names:                  Name[];
}

export interface Color {
  name: string;
  url:  string;
}

export interface EvolutionChain {
  url: string;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language:    Color;
  version:     Color;
}

export interface FormDescription {
  description: string;
  language:    Color;
}

export interface Genus {
  genus:    string;
  language: GenericData;
}

export interface Name {
  language: Color;
  name:     string;
}

export interface PokedexNumber {
  entry_number: number;
  pokedex:      Color;
}

export interface Variety {
  is_default: boolean;
  pokemon:    Color;
}


export interface APIResponse {
  count:    number;
  next:     null;
  previous: null;
  results:  Result[];
}

export interface Result {
  name: string;
  url:  string;
}


export interface PokemonAbilityDetails {
  flavor_text_entries: FlavorTextEntry[];
  name:                string;
  names:               Name[];
}


export interface Name {
  language: Color;
  name:     string;
}



export interface PokemonTypeDetails {
  id:                    number;
  moves:                 Color[];
  name:                  string;
  names:                 Name[];
}


export interface Name {
  language: GenericData;
  name:     string;
}

export interface PokemonResult {
  name: string;
  url: string;
}

export interface SpecieDetails {
  name: string;
  description: string;
  class: string
}

export interface PokemonType {
  slot: number;
  type: Color;
}

export interface PokemonAbility {
  slot: number;
  ability: Color;
  is_hidden: boolean;
}

export interface TypeDetails {
  name: string;
}

export interface AbilityDetails {
  name: string;
}