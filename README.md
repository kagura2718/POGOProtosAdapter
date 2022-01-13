# POGOProtosAdapter

**Now Testing**

This repository contains PokémonGo app tool data that use on Github Action with Periodically action. Connect [POGOProtos](https://github.com/Furtif/POGOProtos) and [PokemonTranslationData](https://github.com/kagura2718/PokemonTranslationData) with id or English translation text.

Construct the json and push these data to [PokemonGoBuildData](https://github.com/kagura2718/PokemonGoBuildData) repository.

License under [ECL-2.0](http://www.osedu.org/licenses/ECL-2.0) Same as POGOProtos.



## For developer

### Cofiguration

need configure ./typings/.npmrc file with `write package permission` to publish npm package to Github package at [here](https://github.com/settings/tokens/)


Sample of .npmrc:

```
@kagura2718:registry=https://npm.pkg.github.com

//npm.pkg.github.com/:_authToken=***Your Secret Token***
```

### Publish package

```
cd typings
```

Upgrade package.json version

```
npm publish
```

