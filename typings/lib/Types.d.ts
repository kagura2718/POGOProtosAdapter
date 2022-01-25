export declare type RawTemplateJson = any;
export interface BuiltTemplateJson {
}
export declare type FullTemplateItemJson = {
    raw: RawTemplateJson;
    built: BuiltTemplateJson;
};
export declare type FullTemplateJson = {
    [templateId: string]: FullTemplateItemJson;
};
export interface LevelJson {
    version: number;
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
export interface PokemonBaseStats {
    baseAttack: number;
    baseDefense: number;
    baseStamina: number;
}
export interface PokemonFormBuiltJson {
    stats: PokemonBaseStats;
    pokemonTypes?: PokemonTypes;
    pokemonType: PokemonTypeEnum;
    pokemonType2?: PokemonTypeEnum;
    tempEvoOverrides?: {
        [tempEvoId: string]: {
            pokemonTypes?: PokemonTypes;
            stats: PokemonBaseStats;
        };
    };
    isGalarian?: boolean;
    isAlola?: boolean;
    pokedexNumber: number;
}
export declare type PokemonFormJson = {
    raw: RawTemplateJson;
    built: PokemonFormBuiltJson;
};
export declare type PokemonFormsJson = {
    [pokemonId: string]: PokemonFormJson[];
};
export interface MovesDatabaseJson {
    [movementId: string]: MovesJson;
}
export interface CombatBuiltJson {
    movesType: PokemonTypeEnum;
    energyDelta: number;
    power: number;
}
export interface CombatOverridesJson extends CombatBuiltJson {
    rigidTurn: number;
    EPT: number;
}
export interface CombatJson {
    raw: RawTemplateJson;
    built: CombatBuiltJson;
}
export interface CombatDatabaseJson {
    [movementId: string]: CombatJson;
}
export interface MovesBuiltJson {
    combatOverrides?: CombatOverridesJson;
    movesType: PokemonTypeEnum;
    movesTypeWrap?: PokemonTypeEnum;
    damageWindowEndMs: number;
    damageWindowStartMs: number;
    durationMs: number;
    energyDelta: number;
    power: number;
    isQuickMoves: boolean;
    isCinematicMoves: boolean;
}
export declare type MovesDetailsJson = MovesBuiltJson;
export interface MovesJson {
    raw: RawTemplateJson;
    built: MovesBuiltJson;
}
export declare type PokemonFamilyJson = any;
export declare type PokemonFamiliesJson = {
    [key: string]: PokemonFamilyJson;
};
export declare type NameConversionTable = {
    [name: string]: string;
};
export interface BasenameDatabaseJson {
    ids: string[];
    conversion: NameConversionTable;
    conversionInv: NameConversionTable;
    evolutionMap: PokemonEvolutionBranchDatabase;
}
export declare type BasenameDatabase = BasenameDatabaseJson;
export interface PokemonTypeJson {
    attackWeight: number[];
    boostWeathers: WeatherEnum[];
    boostWeather: WeatherEnum;
    keyColor: string;
    themeColor: string;
    themeForeColor: string;
}
export interface PokemonTypeDatabaseJson {
    weatherSettings: {
        weather: WeatherEnum;
        pokemonTypes: PokemonTypeEnum[];
    }[];
    attackWeightScalar: number[][];
    types: PokemonTypeJson[];
}
export declare type PokemonTypeDefinitionJson = PokemonTypeDatabaseJson;
export declare type AdjustmentJson = PokemonTypeDatabaseJson;
export declare enum PokemonTypeEnum {
    Normal = 0,
    Fighting = 1,
    Flying = 2,
    Poison = 3,
    Ground = 4,
    Rock = 5,
    Bug = 6,
    Ghost = 7,
    Steel = 8,
    Fire = 9,
    Water = 10,
    Grass = 11,
    Electric = 12,
    Psychic = 13,
    Ice = 14,
    Dragon = 15,
    Dark = 16,
    Fairy = 17
}
export declare type CombatTypeEnum = PokemonTypeEnum;
export declare enum AttackEffectivenessEnum {
    VeryEffective = 0,
    Effective = 1,
    Standard = 2,
    Uneffective = 3,
    VeryUneffective = 4,
    SuperUneffective = 5
}
export declare enum PokemonTypeEffectivenessEnum {
    NotEffective = 0,
    Normal = 1,
    NotVeryEffective = 2,
    SuperEffective = 3
}
export declare enum WeatherEnum {
    Clear = 0,
    Fog = 1,
    Overcast = 2,
    PartlyCloudy = 3,
    Rainy = 4,
    Snow = 5,
    Windy = 6
}
export declare const WEATHER_CONVERSION: {
    [key: string]: WeatherEnum;
};
export declare const POKEMON_TYPE_CONVERSION: {
    [key: string]: PokemonTypeEnum;
};
export declare type I18NEntry = {
    [lang: string]: string;
};
export declare type PogoIdSimpleConversionTable = {
    [id: string]: string;
};
export declare type PogoIdInterpolationTable = {
    [id: string]: I18NEntry;
};
export interface PogoIdEnConversionTable {
    table: PogoIdSimpleConversionTable;
    interpolation: PogoIdInterpolationTable;
}
export declare type PokemonEvolutionBranchDatabase = {
    [pokemonId: string]: PokemonEvolutionBranchMatcher[];
};
export interface PokemonEvolutionBranchMatcher {
    ownId: string;
    pokemonId: string;
    pokemonForm?: string;
    megaBranch?: string;
}
