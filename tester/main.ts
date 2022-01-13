import { z } from "zod";

type toZod<T extends Record<string, any>> = {
  [K in keyof T]-?: z.ZodType<T[K]>;
}


export interface AddressablePokemonSettings {
  pokemonId: string[];
};

const ZAddressablePokemonSettings = {
  pokemonId: z.array(z.string()),
}

const ZIAddressablePokemonSettings = z.object<toZod<AddressablePokemonSettings>>(ZAddressablePokemonSettings);

export interface AddressBookImportSettings {
  isEnabled : boolean;
  onboardingScreenLevel : number;
  showOptOutCheckbox : boolean;
}

const ZAddressBookImportSettings = {
  isEnabled: z.boolean(),
  onboardingScreenLevel: z.number(),
  showOptOutCheckbox: z.boolean(),
}

const ZIAddressBookImportSettings = z.object<toZod<AddressBookImportSettings>>(ZAddressBookImportSettings);

export interface ArTelemetrySettings {
  batterySamplingIntervalMs: number;
  framerateSamplingIntervalMs : number;
  measureBattery : boolean;
  measureFramerate : boolean;
  percentageSessionsToSample : number;
}

const ZArTelemetrySettings = {
  batterySamplingIntervalMs: z.number(),
  framerateSamplingIntervalMs : z.number(),
  measureBattery: z.boolean(),
  measureFramerate: z.boolean(),
  percentageSessionsToSample: z.number(),
}

const ZIArTelemetrySettings = z.object<toZod<ArTelemetrySettings>>(ZArTelemetrySettings);


const ZIAllTemplateSettings = z.union([
  ZIArTelemetrySettings,
  ZIAddressBookImportSettings,
  ZIAddressablePokemonSettings,
]);

export interface templateSettings {
  templateId: string;
  addressablePokemonSettings?: AddressablePokemonSettings;
  addressBookImportSettings?: AddressBookImportSettings;
  arTelemetrySettings?: ArTelemetrySettings;
  // TODO add all
};

const ZTemplateSettings = {
  templateId: z.string(),
  addressablePokemonSettings: ZIAddressablePokemonSettings.optional(),
  addressBookImportSettings: ZIAddressBookImportSettings.optional(),
  arTelemetrySettings: ZIArTelemetrySettings.optional(),
};

const ZITemplateSettings = z.object(ZTemplateSettings);

export interface FullJsonSettings {
  built: any;                   // No check here.
  raw: templateSettings;
}

const ZIFullJsonSettings = z.object({
  built: z.any(),
  raw: z.any(),
});

export interface FullJson {
  [key: string] : FullJsonSettings;
}

export type rawSettings  = AddressBookImportSettings | AddressablePokemonSettings | ArTelemetrySettings;

// const templateType = z.union([
//   z.instanceof(addressBookImportSettings),
//   z.instanceof(arTelemetrySettings),
//   z.instanceof(arTelemetrySettings),
// ]);

// const templateType = z.object(z.instanceof(FullJson));

const json = require('./test-template.json');

console.log('TODO json', json);

for (const id in json) {
  const x = json[id];

  const settings = ZIFullJsonSettings.parse(x);

  console.log('TODO settings', settings);

  const raw = ZITemplateSettings.parse(settings.raw);

  console.log('TODO raw', raw);
  // ZIAllTemplateSettings.parse(settings.raw['addressablePokemonSettings'] || settings.raw['addressBookImportSettings'] || settings.raw['arTelemetrySettings']);
}

// const validSettings: FullJson = templateType.parse(json)

// console.log('TODO', validSettings);

// export interface IHoge {
//   a: string;
//   bb: number;
// }

// const ZHoge = {
//   a: z.string(),
//   bb: z.number(),
// };

// const zIHoge = z.object<toZod<IHoge>>(ZHoge);


// const testjson = require('./testtest.json');
// const x2 = zIHoge.parse(testjson);

// console.log('TODO', x2);
