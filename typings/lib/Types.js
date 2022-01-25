export var PokemonTypeEnum;
(function (PokemonTypeEnum) {
    PokemonTypeEnum[PokemonTypeEnum["Normal"] = 0] = "Normal";
    PokemonTypeEnum[PokemonTypeEnum["Fighting"] = 1] = "Fighting";
    PokemonTypeEnum[PokemonTypeEnum["Flying"] = 2] = "Flying";
    PokemonTypeEnum[PokemonTypeEnum["Poison"] = 3] = "Poison";
    PokemonTypeEnum[PokemonTypeEnum["Ground"] = 4] = "Ground";
    PokemonTypeEnum[PokemonTypeEnum["Rock"] = 5] = "Rock";
    PokemonTypeEnum[PokemonTypeEnum["Bug"] = 6] = "Bug";
    PokemonTypeEnum[PokemonTypeEnum["Ghost"] = 7] = "Ghost";
    PokemonTypeEnum[PokemonTypeEnum["Steel"] = 8] = "Steel";
    PokemonTypeEnum[PokemonTypeEnum["Fire"] = 9] = "Fire";
    PokemonTypeEnum[PokemonTypeEnum["Water"] = 10] = "Water";
    PokemonTypeEnum[PokemonTypeEnum["Grass"] = 11] = "Grass";
    PokemonTypeEnum[PokemonTypeEnum["Electric"] = 12] = "Electric";
    PokemonTypeEnum[PokemonTypeEnum["Psychic"] = 13] = "Psychic";
    PokemonTypeEnum[PokemonTypeEnum["Ice"] = 14] = "Ice";
    PokemonTypeEnum[PokemonTypeEnum["Dragon"] = 15] = "Dragon";
    PokemonTypeEnum[PokemonTypeEnum["Dark"] = 16] = "Dark";
    PokemonTypeEnum[PokemonTypeEnum["Fairy"] = 17] = "Fairy";
})(PokemonTypeEnum || (PokemonTypeEnum = {}));
export var AttackEffectivenessEnum;
(function (AttackEffectivenessEnum) {
    AttackEffectivenessEnum[AttackEffectivenessEnum["VeryEffective"] = 0] = "VeryEffective";
    AttackEffectivenessEnum[AttackEffectivenessEnum["Effective"] = 1] = "Effective";
    AttackEffectivenessEnum[AttackEffectivenessEnum["Standard"] = 2] = "Standard";
    AttackEffectivenessEnum[AttackEffectivenessEnum["Uneffective"] = 3] = "Uneffective";
    AttackEffectivenessEnum[AttackEffectivenessEnum["VeryUneffective"] = 4] = "VeryUneffective";
    AttackEffectivenessEnum[AttackEffectivenessEnum["SuperUneffective"] = 5] = "SuperUneffective";
})(AttackEffectivenessEnum || (AttackEffectivenessEnum = {}));
export var PokemonTypeEffectivenessEnum;
(function (PokemonTypeEffectivenessEnum) {
    PokemonTypeEffectivenessEnum[PokemonTypeEffectivenessEnum["NotEffective"] = 0] = "NotEffective";
    PokemonTypeEffectivenessEnum[PokemonTypeEffectivenessEnum["Normal"] = 1] = "Normal";
    PokemonTypeEffectivenessEnum[PokemonTypeEffectivenessEnum["NotVeryEffective"] = 2] = "NotVeryEffective";
    PokemonTypeEffectivenessEnum[PokemonTypeEffectivenessEnum["SuperEffective"] = 3] = "SuperEffective";
})(PokemonTypeEffectivenessEnum || (PokemonTypeEffectivenessEnum = {}));
export var WeatherEnum;
(function (WeatherEnum) {
    WeatherEnum[WeatherEnum["Clear"] = 0] = "Clear";
    WeatherEnum[WeatherEnum["Fog"] = 1] = "Fog";
    WeatherEnum[WeatherEnum["Overcast"] = 2] = "Overcast";
    WeatherEnum[WeatherEnum["PartlyCloudy"] = 3] = "PartlyCloudy";
    WeatherEnum[WeatherEnum["Rainy"] = 4] = "Rainy";
    WeatherEnum[WeatherEnum["Snow"] = 5] = "Snow";
    WeatherEnum[WeatherEnum["Windy"] = 6] = "Windy";
})(WeatherEnum || (WeatherEnum = {}));
export const WEATHER_CONVERSION = {
    "CLEAR": WeatherEnum.Clear,
    "FOG": WeatherEnum.Fog,
    "OVERCAST": WeatherEnum.Overcast,
    "PARTLY_CLOUDY": WeatherEnum.PartlyCloudy,
    "RAINY": WeatherEnum.Rainy,
    "SNOW": WeatherEnum.Snow,
    "WINDY": WeatherEnum.Windy,
};
export const POKEMON_TYPE_CONVERSION = {
    "POKEMON_TYPE_BUG": PokemonTypeEnum.Bug,
    "POKEMON_TYPE_DARK": PokemonTypeEnum.Dark,
    "POKEMON_TYPE_DRAGON": PokemonTypeEnum.Dragon,
    "POKEMON_TYPE_ELECTRIC": PokemonTypeEnum.Electric,
    "POKEMON_TYPE_FAIRY": PokemonTypeEnum.Fairy,
    "POKEMON_TYPE_FIGHTING": PokemonTypeEnum.Fighting,
    "POKEMON_TYPE_FIRE": PokemonTypeEnum.Fire,
    "POKEMON_TYPE_FLYING": PokemonTypeEnum.Flying,
    "POKEMON_TYPE_GHOST": PokemonTypeEnum.Ghost,
    "POKEMON_TYPE_GRASS": PokemonTypeEnum.Grass,
    "POKEMON_TYPE_GROUND": PokemonTypeEnum.Ground,
    "POKEMON_TYPE_ICE": PokemonTypeEnum.Ice,
    "POKEMON_TYPE_NORMAL": PokemonTypeEnum.Normal,
    "POKEMON_TYPE_POISON": PokemonTypeEnum.Poison,
    "POKEMON_TYPE_PSYCHIC": PokemonTypeEnum.Psychic,
    "POKEMON_TYPE_ROCK": PokemonTypeEnum.Rock,
    "POKEMON_TYPE_STEEL": PokemonTypeEnum.Steel,
    "POKEMON_TYPE_WATER": PokemonTypeEnum.Water,
};
//# sourceMappingURL=Types.js.map