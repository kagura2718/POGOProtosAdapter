import * as fs from 'fs';
import * as path from 'path';

import {
  FullTemplateJson, RawTemplateJson,
  LevelJson, BasenameDatabase,
  PokemonEvolutionBranchMatcher, PokemonEvolutionBranchDatabase,
  PokemonFormsJson, PokemonFormJson,
  NameConversionTable,
  PokemonTypeEnum, PokemonFormBuiltJson,
  PokemonTypeDatabaseJson, PokemonTypeJson,
  WeatherEnum,
  CombatDatabaseJson, CombatJson,
  MovesDatabaseJson, MovesJson, MovesBuiltJson,
  CombatBuiltJson, CombatOverridesJson,
  POKEMON_TYPE_CONVERSION, WEATHER_CONVERSION,
  PogoIdEnConversionTable, PogoIdSimpleConversionTable, PogoIdInterpolationTable,
  PokemonTypes, PokemonBaseStats,
}   from '../src/Types';

function usage() {
  console.log(`usage: build MASTER-JSON OUTPUT-DIRECTORY`);
}

const LevelJsonVersion = 1;

const PokemonTypeAttackScalarConversion: { [key: number]: PokemonTypeEnum } = {
  0: PokemonTypeEnum.Normal,
  1: PokemonTypeEnum.Fighting,
  2: PokemonTypeEnum.Flying,
  3: PokemonTypeEnum.Poison,
  4: PokemonTypeEnum.Ground,
  5: PokemonTypeEnum.Rock,
  6: PokemonTypeEnum.Bug,
  7: PokemonTypeEnum.Ghost,
  8: PokemonTypeEnum.Steel,
  9: PokemonTypeEnum.Fire,
  10: PokemonTypeEnum.Water,
  11: PokemonTypeEnum.Grass,
  12: PokemonTypeEnum.Electric,
  13: PokemonTypeEnum.Psychic,
  14: PokemonTypeEnum.Ice,
  15: PokemonTypeEnum.Dragon,
  16: PokemonTypeEnum.Dark,
  17: PokemonTypeEnum.Fairy,
};

function cloneJson(json: any): any {
  return JSON.parse(JSON.stringify(json));
}

// TODO should use io-ts fp-ts to test upstream has expected value type or not
function buildFullTemplates(master: any): FullTemplateJson {
  const full: FullTemplateJson = {};

  for (const template of master['template']) {
    if (!('templateId' in template)) {
      throw new Error(`Unexpectedly templateId is missing`);
    }

    const id = template['templateId'];

    full[id] = {
      raw: template['data'],
      built: {},
    };
  }

  return full;
}

const Arguments: { [key: string]: any } = {};

function parseCommandLine() {
  const commandArgs: string[] = process.argv.slice(2);

  if (commandArgs.length !== 2) {
    usage();
    process.exit(1);
  }
  const masterJson = commandArgs[0]

  if (!fs.existsSync(masterJson)) {
    usage();
    process.exit(1);
  }

  const outputDirectory = commandArgs[1]

  console.log(`${masterJson} -> ${outputDirectory}`);

  Arguments.masterJson = masterJson;
  Arguments.outputDirectory = outputDirectory;
}

function constructLevelCost(source: number[]): number[] {
  const s = source;
  const res = [];

  for (var i = 0; i < s.length; i++) {
    const v0 = s[i];
    res.push(v0);
    res.push(v0);
  }

  return res;
}

function buildCPMList(s: number[]) {
  const res = [];

  for (var i = 0; i < s.length - 1; i++) {
    const v0 = s[i];
    const diff = s[i + 1] - v0;
    const v1 = s[i] + (diff / 2);

    res.push(v0);
    res.push(v1);
  }

  res.push(s[s.length - 1]);

  return res;
}

function buildLevel(full: FullTemplateJson): LevelJson {
  const upgrades = full['POKEMON_UPGRADE_SETTINGS'].raw['pokemonUpgrades'];
  const playerLevel = full['PLAYER_LEVEL_SETTINGS'].raw['playerLevel'];
  const combat = full['COMBAT_SETTINGS'].raw['combatSettings'];

  const evolutionMap: PokemonEvolutionBranchDatabase = {};
  const evolutionMatchers = require('../ConversionTables/PokemonEvolutionDatabase.pretty.json') as PokemonEvolutionBranchMatcher[];

  for (const m of evolutionMatchers) {
    if (!(m.pokemonId in evolutionMap)) {
      evolutionMap[m.pokemonId] = [];
    }

    evolutionMap[m.pokemonId].push(m);
  }

  return {
    version: LevelJsonVersion,
    requireCandyCost: constructLevelCost(upgrades['candyCost']),
    requireStardustCost: constructLevelCost(upgrades['stardustCost']),
    requireXlCandyCost: constructLevelCost(Array(39).fill(0).concat(upgrades['xlCandyCost'])),
    shadowAttackBonus: combat['shadowPokemonAttackBonusMultiplier'],
    shadowDefenceBonus: combat['shadowPokemonDefenseBonusMultiplier'],
    sameTypeBonus: combat['sameTypeAttackBonusMultiplier'],
    CPM: buildCPMList(playerLevel['cpMultiplier']),
    evolutionMap,
  }
}

function buildBasenames(full: FullTemplateJson, level: LevelJson): BasenameDatabase {
  const ids = [];

  for (const templateId in full) {
    const data = full[templateId];

    if (!('formSettings' in data.raw)) {
      continue;
    }

    const settings = data.raw['formSettings'];
    const name = settings['pokemon'];

    if (!/^[A-Z0-9_]+$/.test(name)) {
      throw new Error(`${name} is not expected.`);
    }

    if (name in ids) {
      throw new Error(`${name} is already exists in form database`);
    }


    ids.push(name);
  }

  // Special conversion to Friendly Name to internal id
  const conversion: NameConversionTable = require('../ConversionTables/PokemonEnglish2PokemonId.pretty.json');

  const conversionInv: NameConversionTable = {};

  for (const friendlyName in conversion) {
    const key = conversion[friendlyName];
    conversionInv[key] = friendlyName;
  }

  return {
    ids,
    conversion,
    conversionInv,
    evolutionMap: level.evolutionMap,
  };
}

function buildPokemonTypeDefs(full: FullTemplateJson): PokemonTypeDatabaseJson {
  let weatherSettings = [] ;

  for (const templateId in full) {
    const data = full[templateId];

    if (!('weatherAffinities' in data.raw)) {
      continue;
    }

    const settings = data.raw['weatherAffinities'];
    const name = settings['weatherCondition'];
    const pokemonTypes = settings['pokemonType'] as string[];

    const weatherSetting = {
      weather: WEATHER_CONVERSION[name],
      pokemonTypes: pokemonTypes.map(s => POKEMON_TYPE_CONVERSION[s] as PokemonTypeEnum),
    };

    weatherSettings.push(weatherSetting);
  }

  const attackWeightScalar = Array(Object.keys(PokemonTypeEnum).length / 2);

  for (const templateId in full) {
    const data = full[templateId];

    if (!('typeEffective' in data.raw)) {
      continue;
    }

    const settings = data.raw['typeEffective'];
    const attackType = settings['attackType'];
    const scalar = settings['attackScalar'] as number[];
    const pokemonType = POKEMON_TYPE_CONVERSION[attackType];

    attackWeightScalar[pokemonType] = convertAttackScalar(scalar);
  }

  const typeDefTable: { [ key: string] : any } = require('../ConversionTables/PokemonType.pretty.json');
  const types: PokemonTypeJson[] = Array(Object.keys(PokemonTypeEnum).length / 2);

  for (const key in typeDefTable) {
    const def = typeDefTable[key];
    const typeEnum = PokemonTypeNameToEnum(key);
    const themeColor: string = def['color'];
    // TODO should be improved
    const themeForeColor: string = 'white';
    const keyColor = themeColor;

    const boostWeathers: WeatherEnum[] = [];

    for (const settings of weatherSettings) {

      for (const pokemonType of settings.pokemonTypes) {
        if (pokemonType === typeEnum) {
          boostWeathers.push(settings.weather);
        }
      }
    }

    if (boostWeathers.length !== 1) {
      throw new Error(`Weather unexpectedly not unique.`);
    }

    const attackWeight = attackWeightScalar[typeEnum];

    types[typeEnum] = {
      attackWeight,
      boostWeathers,
      boostWeather: boostWeathers[0],
      themeColor,
      themeForeColor,
      keyColor,
    };
  }

  return {
    weatherSettings,
    attackWeightScalar,
    types,
  };
}

// TODO FIXME: Enum -> Union
// https://typescript-jp.gitbook.io/deep-dive/type-system/enums
// https://www.kabuku.co.jp/developers/good-bye-typescript-enum
function PokemonTypeNameToEnum(s: string): PokemonTypeEnum {
  const obj = PokemonTypeEnum as any;

  if (s in obj) {
    return obj[s] as PokemonTypeEnum;
  }

  throw new Error(`Not found key of PokemonTypeEnum ${s}`);
}

function convertAttackScalar(scalar: number[]): number[] {
  const result = Array(Object.keys(PokemonTypeEnum).length / 2);

  for (let i = 0; i < scalar.length; i++) {
    result[PokemonTypeAttackScalarConversion[i]] = scalar[i];
  }

  return result;
}

// function buildFamilies(_full: FullTemplateJson): PokemonFamiliesJson {
//   return {}
// }

function buildPokemonForm(raw: any, templateId: string): PokemonFormBuiltJson {
  if (!('stats' in raw)) {
    throw new Error(`Unexpectedly doesn't have 'stats' slot.`);
  }

  const idMatch = /^V([0-9]+)_/.exec(templateId);

  if (!idMatch) {
    throw new Error(`Unexpected templateId:${templateId} to parse pokedex number`);
  }

  const pokedexNumber = Number.parseInt(idMatch[1]);
  const stats: PokemonBaseStats = raw['stats'];
  const json: PokemonFormBuiltJson = {
    pokemonType: POKEMON_TYPE_CONVERSION[raw['type']],
    stats,
    pokedexNumber,
  }

  json.pokemonTypes = {
    pokemonType: json.pokemonType,
  }

  if ('form' in raw) {
    const form = raw['form'] as string;

    if (/_ALOLA$/.test(form)) {
      json.isAlola = true;
    }

    if (/_GALARIAN$/.test(form)) {
      json.isGalarian = true;
    }
}

  if ('type2' in raw) {
    json.pokemonType2 = POKEMON_TYPE_CONVERSION[raw['type2']];
    json.pokemonTypes.pokemonType2 = json.pokemonType2;
  }

  if ('tempEvoOverrides' in raw) {
    json.tempEvoOverrides = {};

    for (const tmp of raw['tempEvoOverrides']) {
      const tempEvoId = tmp['tempEvoId'];
      const pokemonTypes: PokemonTypes = {
        pokemonType: POKEMON_TYPE_CONVERSION[tmp['typeOverride']],
      };

      if ('typeOverride2' in tmp) {
        pokemonTypes.pokemonType2 = POKEMON_TYPE_CONVERSION[tmp['typeOverride2']];
      }

      if (!('stats' in tmp)) {
        throw new Error(`Unexpectedly ${tempEvoId} doesn't have 'stats' slot.`);
      }

      const stats: PokemonBaseStats = tmp['stats'];

      json.tempEvoOverrides[tempEvoId] = {
        pokemonTypes,
        stats,
      };
    }
  }

  return json;
}

function buildForms(full: FullTemplateJson, _basenames: string[]): PokemonFormsJson {
  const res: PokemonFormsJson = {};

  // TODO this should be truncated if all ability is same (costume maybe differ)
  // TODO check all basenames must contain some form
  for (const templateId in full) {
    const data = full[templateId]

    if (!('pokemonSettings' in data.raw)) {
      continue;
    }

    const settings = data.raw['pokemonSettings'];
    const pokemonId = settings['pokemonId']

    let item = res[pokemonId];

    if (!item) {
      item = [];
    }

    settings.raw = cloneJson(settings);
    settings.built = buildPokemonForm(settings, templateId);

    item.push(settings);

    res[pokemonId] = item;
  }

  return res;
}

function checkMegaEvolution(forms: PokemonFormJson[]) {

  const doneTable = require('../ConversionTables/PokemonEvolutionDatabase.pretty.json') as PokemonEvolutionBranchMatcher[];

  for (const f of forms) {
    // All of forms pokemonId are same although.
    const pokemonId = f.raw['pokemonId'];
    const pokemonForm = f.raw['form'];

    if (!('evolutionBranch' in f.raw)) {
      continue;
    }

    for (const branch of f.raw['evolutionBranch']) {
      const megaBranch = branch['temporaryEvolution'];

      if (!megaBranch) {
        continue;
      }

      const jsonObj: PokemonEvolutionBranchMatcher = {
        ownId: `@MEGA_${pokemonId}`,
        pokemonId,
        megaBranch,
      };

      if (pokemonForm) {
        jsonObj.pokemonForm = pokemonForm;
      }

      const existing = doneTable.find(x => {
        if (x.pokemonId !== pokemonId) {
          return false;
        }

        if (x.megaBranch !== megaBranch) {
          return false;
        }

        if (x.pokemonForm && pokemonForm && x.pokemonForm !== pokemonForm) {
          return false;
        }

        return true;
      });

      if (!existing) {
        console.error(`Not existing Mega evolution form Template: ${JSON.stringify(jsonObj)}`);
      }
    }
  }
}

function buildCombat(full: FullTemplateJson): CombatDatabaseJson {
  const db: CombatDatabaseJson = {};

  for (const templateId in full) {
    const data = full[templateId];

    if (!('combatMove' in data.raw)) {
      continue;
    }

    const settings = data.raw['combatMove'];
    const movementId = settings['uniqueId'];
    const power = settings['power'];
    const energyDelta = settings['energyDelta'];

    const built: CombatBuiltJson = {
      movesType: POKEMON_TYPE_CONVERSION[settings['type']],
      energyDelta,
      power,
    }

    const item: CombatJson = {
      raw: settings,
      built,
    };

    db[movementId] = item;
  }

  return db;
}

function buildMoveJson(template: RawTemplateJson, movementId: string, combat?: CombatJson): MovesBuiltJson {
  const isQuickMoves: boolean = !!(/_FAST$/.test(movementId));
  const details: MovesBuiltJson = {
    // TODO consider HIDDEN_POWER_FAST
    movesType: POKEMON_TYPE_CONVERSION[template['pokemonType']],
    movesTypeWrap: POKEMON_TYPE_CONVERSION[template['pokemonType']],
    damageWindowEndMs: template['damageWindowEndMs'],
    damageWindowStartMs: template['damageWindowStartMs'],
    durationMs: template['durationMs'],
    energyDelta: template['energyDelta'],
    power: template['power'],
    isQuickMoves,
    isCinematicMoves: !isQuickMoves,
  };

  let combatOverrides: CombatOverridesJson | undefined = undefined;

  if (combat && isQuickMoves) {
    combatOverrides = combat.built as CombatOverridesJson;

    // TODO now testing this compution
    const rigidTurn = Math.ceil(details.durationMs / 500);
    const EPT = combat.built.energyDelta / rigidTurn;

    combatOverrides.rigidTurn = rigidTurn;
    combatOverrides.EPT = EPT;
  }

  if (combatOverrides) {
    details.combatOverrides = combatOverrides;
  }

  return details;
}

function buildMoves(full: FullTemplateJson, combatData: CombatDatabaseJson): MovesDatabaseJson {
  const db: MovesDatabaseJson = {};

  for (const templateId in full) {
    const data = full[templateId];

    if (!('moveSettings' in data.raw)) {
      continue;
    }

    const settings = data.raw['moveSettings'];
    const movementId = settings['movementId']
    const combatOverrides = combatData[movementId];

    if (!combatOverrides) {
      console.warn(`movementId:${movementId} not found in combatData`);
    }

    const built = buildMoveJson(settings, movementId, combatOverrides);

    const item: MovesJson = {
      raw: settings,
      built,
    }


    db[movementId] = item;
  }

  return db;
}

function doBuild() {
  if (process.argv.length < 2) {
    throw new Error(`Unknown args of length ${process.argv}`);
  }

  parseCommandLine();

  const master = JSON.parse(fs.readFileSync(Arguments.masterJson, 'utf8'));
  const full = buildFullTemplates(master);

  writeJson('full.json', full);

  const level = buildLevel(full);
  writeJson('pokemon/level.json', level);

  const basenames = buildBasenames(full, level);
  writeJson('pokemon/basenames.json', basenames);

  const combats = buildCombat(full);
  writeJson('combats.json', combats);

  const moves = buildMoves(full, combats);
  writeJson('moves.json', moves);

  // const families = buildFamilies(full);
  // for (const familyId in families) {
  //   writeJson('pokemon/family/${familyId}.json', families[familyId]);
  // }

  const forms = buildForms(full, basenames.ids);
  for (const pokemonId in forms) {
    const pokemonForms = forms[pokemonId];

    writeJson(`pokemon/forms/${pokemonId}.json`, pokemonForms);

    checkMegaEvolution(pokemonForms);
  }

  const pokemonTypes = buildPokemonTypeDefs(full);
  writeJson(`adjustments.json`, pokemonTypes);
  writeJson(`pokemon-type.json`, pokemonTypes);

  // TODO translation table. only model (pogoprotos id) -> view (translation data `en` entry)
  // Currently, pokemon.json(id -> `en`), moves.json(id -> `en`), weather.json (enum -> `en`)
  const translationPokemon = buildPokemonTranslationTable(basenames);
  writeJson(`translation/pokemon.json`, translationPokemon);

  const translationMoves = buildMovesTranslationTable(moves);
  writeJson(`translation/moves.json`, translationMoves);
}

function buildPokemonTranslationTable(basenames: BasenameDatabase): PogoIdEnConversionTable {
  const table: PogoIdSimpleConversionTable = {};
  const translationJson = require('../PokemonTranslationData/data/pokemon.pretty.json');
  const translateTable: { [key: string] : any } = {};

  for (const entry of translationJson['data']) {
    const en = entry['i18n']['en'];

    translateTable[en] = entry;
  }

  const interpolation: PogoIdInterpolationTable = require('../ConversionTables/pokemon-interpolation.pretty.json');
  const conversion: NameConversionTable = require('../ConversionTables/PokemonEnglish2PokemonId.pretty.json');
  const conversionInv: NameConversionTable = {};

  for (const friendlyName in conversion) {
    const key = conversion[friendlyName];
    conversionInv[key] = friendlyName;
  }

  for (const id of basenames.ids) {
    let key: string;

    if (id in conversionInv) {
      key = conversionInv[id];
    } else if (id in interpolation) {
      if (id in translateTable) {
        throw new Error(`Found translation entry id:${id}`);
      }
      continue;
    } else {
      key = capitalize(id);
    }

    if (!(key in translateTable)) {
      throw new Error(`Not found for ${id} to ${key}`);
    }

    if (key in table) {
      throw new Error(`Already registerd ${key}`);
    }

    table[id] = key;
  }

  return {
    table,
    interpolation,
  };
}

function capitalize(s: string): string {
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}
function capitalizeWords(partOfId: string) {
  return partOfId.split('_').map(capitalize).join(' ');
}

// TODO should handle some of other name.
//  not in translation table, but this id is clearly included in game app.
// TODO *_BLASTOISE, WRAP_* MUD_SLAP_FAST
const specialMovesTable: { [id: string] : string | null; } = require('../ConversionTables/Moves2MovesEnglish.pretty.json');;

function buildMovesTranslationTable(moves: MovesDatabaseJson): PogoIdEnConversionTable {
  const table: PogoIdSimpleConversionTable = {};
  const translationJson = require('../PokemonTranslationData/data/moves.pretty.json');
  const translateTable: { [key: string] : any } = {};

  for (const entry of translationJson['data']) {
    const en = entry['i18n']['en'];

    translateTable[en] = entry;
  }

  const interpolation: PogoIdInterpolationTable = require('../ConversionTables/moves-interpolation.pretty.json');

  for (const id in moves) {

    let key: string | null;
    if (id in specialMovesTable) {
      key = specialMovesTable[id];
    } else if (id in interpolation) {
      key = null;
    } else {
      const m = /^(.+?)_FAST$/.exec(id);

      if (m) {
        const basename = m[1];

        key = capitalizeWords(basename);
      } else {
        key = capitalizeWords(id);
      }

      if (!(key in translateTable)) {
        throw new Error(`Not found for ${id} to ${key}`);
      }
    }

    if (key === null) {
      continue;
    }

    if (key in table) {
      throw new Error(`Already registerd ${key}`);
    }

    table[id] = key;
  }

  return {
    table,
    interpolation,
  };
}

function writeJson(filename: string, json: any) {
  const jsonFile = path.join(Arguments.outputDirectory, filename);
  const parentDir = path.dirname(jsonFile);

  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir);
  }

  fs.writeFileSync(jsonFile, JSON.stringify(json));
}

doBuild();
