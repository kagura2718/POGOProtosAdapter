export type RawTemplateJson = any;
export interface BuiltTemplateJson {
}

export type FullTemplateItemJson = {
  raw: RawTemplateJson;
  built: BuiltTemplateJson;
 };

export type FullTemplateJson = { [templateId: string]: FullTemplateItemJson };

// Interface that hold pokemon/trainer definitions from FullTemplateJson
// TODO should rename. level -> growup?
export interface LevelJson {
  // Version will be upgrade when:
  // - Compution logic is changed
  // - data structure is changed.
  version: number,
  requireCandyCost: number[];
  requireStardustCost: number[];
  requireXlCandyCost: number[];
  shadowAttackBonus: number;
  shadowDefenceBonus: number;
  sameTypeBonus: number;
  CPM: number[];
  evolutionMap: PokemonEvolutionBranchDatabase;
}

export interface PokemonTypes {
  pokemonType: PokemonTypeEnum;
  pokemonType2?: PokemonTypeEnum;
}

// Key is "stats"
export interface PokemonBaseStats {
  baseAttack: number;
  baseDefense: number;
  baseStamina: number;
}

export interface PokemonFormBuiltJson {
  stats: PokemonBaseStats;
  // TODO now progress
  pokemonTypes?: PokemonTypes;
  pokemonType: PokemonTypeEnum;
  pokemonType2?: PokemonTypeEnum;
  tempEvoOverrides?: {
    [ tempEvoId: string ]: {
      pokemonTypes?: PokemonTypes;
      stats: PokemonBaseStats;
    };
  };
  isGalarian?: boolean;
  isAlola?: boolean;
  pokedexNumber: number;
}

export type PokemonFormJson = {
  raw: RawTemplateJson;         //  Raw data from RawTemplateJson.pokemonSettings
  built: PokemonFormBuiltJson;
}

export type PokemonFormsJson = {
  [pokemonId: string]: PokemonFormJson[];
};

export interface MovesDatabaseJson {
  [movementId: string] : MovesJson;
}

export interface CombatBuiltJson {
  movesType: PokemonTypeEnum;
  energyDelta: number;
  power: number;
}

export interface CombatOverridesJson extends CombatBuiltJson {
  /*
   * TODO Now testing
   */
  rigidTurn: number;
  /*
   * TODO Now testing
   */
  EPT: number;
}

// Key is "combatMove"
export interface CombatJson {
  raw: RawTemplateJson;
  built: CombatBuiltJson;
}

export interface CombatDatabaseJson {
  [movementId: string] : CombatJson;
}

// Merge with moves and any
export interface MovesBuiltJson {
  /*
   * Just isQuickMoves true
   */
  combatOverrides?: CombatOverridesJson;
  movesType: PokemonTypeEnum;
  /*
   * TODO Special type to handle HIDDEN_POWER_FAST
   */
  movesTypeWrap?: PokemonTypeEnum;
  // TODO not yet understand the value.
  // staminaLossScalar: number;
  damageWindowEndMs: number;
  damageWindowStartMs: number;
  // TODO 500 chunk to 1 turn when combat
  durationMs: number;
  // TODO V0307_MOVE_CRUSH_CLAW missing this
  // Probablly not using moves. ignore?
  energyDelta: number;
  power: number;
  isQuickMoves: boolean;
  isCinematicMoves: boolean;
}

/**
 * @deprecated should use MovesBuiltJson
 */
export type MovesDetailsJson = MovesBuiltJson;

// Key is "moveSettings"
export interface MovesJson {
  raw: RawTemplateJson;
  built: MovesBuiltJson;
}



// TODO should improve the json type. or not need this.
export type PokemonFamilyJson = any;
export type PokemonFamiliesJson = { [key: string]: PokemonFamilyJson; };

export type NameConversionTable = { [name: string] : string; };

export interface BasenameDatabaseJson {
  /**
   * PokemonId list
   */
  ids: string[];
  /**
   * @deprecated Friendry name to pokemonId
   */
  conversion: NameConversionTable;
  /**
   * @deprecated pokemonId to friendry name
   */
  conversionInv: NameConversionTable;
  /**
   * Special entries when evolve (e.g. Mega Evolution)
   */
  evolutionMap: PokemonEvolutionBranchDatabase;
}

export type BasenameDatabase = BasenameDatabaseJson;

/**
 * PokemonType related definitions
 */
export interface PokemonTypeJson {
  /*
   * key index is PokemonTypeEnum
   */
  attackWeight: number[];
  /*
   * Should not use this field. `boostWeather`
   */
  boostWeathers: WeatherEnum[];
  /*
   * Boosted weather
   */
  boostWeather: WeatherEnum;
  /**
   * Hex
   * @deprecated
   */
  keyColor: string;
  /**
   * Hex color
   */
  themeColor: string;
  /**
   * Well contrasted color to `themeColor`
   */
  themeForeColor: string;
}

/**
 * PokemonType related definitions
 */
export interface PokemonTypeDatabaseJson {
  weatherSettings: {
    weather: WeatherEnum;
    pokemonTypes: PokemonTypeEnum[];
  }[];
  /**
   * key index is PokemonTypeEnum
   */
  attackWeightScalar: number[][];
  /**
   * key index is PokemonTypeEnum
   */
  types: PokemonTypeJson[];
}

/**
 * @deprecated should use PokemonTypeDatabaseJson
 */
export type PokemonTypeDefinitionJson = PokemonTypeDatabaseJson;

/**
 * @deprecated should use PokemonTypeDatabaseJson
 */
export type AdjustmentJson = PokemonTypeDatabaseJson;

export enum PokemonTypeEnum {
  Normal,
  Fighting,
  Flying,
  Poison,
  Ground,
  Rock,
  Bug,
  Ghost,
  Steel,
  Fire,
  Water,
  Grass,
  Electric,
  Psychic,
  Ice,
  Dragon,
  Dark,
  Fairy,
}
export type CombatTypeEnum = PokemonTypeEnum;

export enum AttackEffectivenessEnum {
  VeryEffective,
  Effective,
  Standard,
  Uneffective,
  VeryUneffective,
  SuperUneffective,
}

export enum PokemonTypeEffectivenessEnum {
  NotEffective,
  Normal,                       // TODO no word on https://bulbapedia.bulbagarden.net/wiki/Type
  NotVeryEffective,
  SuperEffective,
}

export enum WeatherEnum {
  Clear,
  Fog,
  Overcast,
  PartlyCloudy,
  Rainy,
  Snow,
  Windy,
}

export const WEATHER_CONVERSION: { [key: string]: WeatherEnum } = {
  "CLEAR"         : WeatherEnum.Clear,
  "FOG"           : WeatherEnum.Fog,
  "OVERCAST"      : WeatherEnum.Overcast,
  "PARTLY_CLOUDY" : WeatherEnum.PartlyCloudy,
  "RAINY"         : WeatherEnum.Rainy,
  "SNOW"          : WeatherEnum.Snow,
  "WINDY"         : WeatherEnum.Windy,
};

export const POKEMON_TYPE_CONVERSION: { [key: string]: PokemonTypeEnum } = {
  "POKEMON_TYPE_BUG"      : PokemonTypeEnum.Bug,
  "POKEMON_TYPE_DARK"     : PokemonTypeEnum.Dark,
  "POKEMON_TYPE_DRAGON"   : PokemonTypeEnum.Dragon,
  "POKEMON_TYPE_ELECTRIC" : PokemonTypeEnum.Electric,
  "POKEMON_TYPE_FAIRY"    : PokemonTypeEnum.Fairy,
  "POKEMON_TYPE_FIGHTING" : PokemonTypeEnum.Fighting,
  "POKEMON_TYPE_FIRE"     : PokemonTypeEnum.Fire,
  "POKEMON_TYPE_FLYING"   : PokemonTypeEnum.Flying,
  "POKEMON_TYPE_GHOST"    : PokemonTypeEnum.Ghost,
  "POKEMON_TYPE_GRASS"    : PokemonTypeEnum.Grass,
  "POKEMON_TYPE_GROUND"   : PokemonTypeEnum.Ground,
  "POKEMON_TYPE_ICE"      : PokemonTypeEnum.Ice,
  "POKEMON_TYPE_NORMAL"   : PokemonTypeEnum.Normal,
  "POKEMON_TYPE_POISON"   : PokemonTypeEnum.Poison,
  "POKEMON_TYPE_PSYCHIC"  : PokemonTypeEnum.Psychic,
  "POKEMON_TYPE_ROCK"     : PokemonTypeEnum.Rock,
  "POKEMON_TYPE_STEEL"    : PokemonTypeEnum.Steel,
  "POKEMON_TYPE_WATER"    : PokemonTypeEnum.Water,
};

// TODO reconsider it. generate new package PokemonTranslation
export type I18NEntry = { [lang: string] : string };
export type PogoIdSimpleConversionTable = { [id: string] : string; };
export type PogoIdInterpolationTable = { [id: string] : I18NEntry; };

export interface PogoIdEnConversionTable {
  table: PogoIdSimpleConversionTable;
  interpolation: PogoIdInterpolationTable;
}

export type PokemonEvolutionBranchDatabase = {
  [pokemonId: string] : PokemonEvolutionBranchMatcher[];
}

export interface PokemonEvolutionBranchMatcher {
  ownId: string;
  pokemonId: string;
  pokemonForm?: string;
  megaBranch?: string;
}
