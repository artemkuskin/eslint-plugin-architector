const absolutePathToFile = require("./absolutePathToFile");
const PathToCurrentFileWithoutContent = require("./pathToCurrentFileWithoutContent");
const path = require("path");

function getLevelAlias(rootDirectory, jsConfigFileContent) {
  const aliases = getAliases(jsConfigFileContent);

  const configurationTreeAlias = [];

  for (let key in aliases) {
    configurationTreeAlias.push({
      key: PathToCurrentFileWithoutContent(aliases[key].key),
      path: path
        .resolve(aliases[key].name.split("/").splice(0, aliases[key].name.split("/").length).join("/"), rootDirectory)
        .split("/")
        .splice(
          0,
          absolutePathToFile(PathToCurrentFileWithoutContent(aliases[key].name), rootDirectory).split("/").length - 1
        )
        .join("/"),
    });
  }
  return configurationTreeAlias;
}

function getAliases(jsConfigFileContent) {
  const aliases = [];

  for (let aliasName in jsConfigFileContent.compilerOptions.paths) {
    /* We access first element of array, because for now we support only aliases with one value. It can be multiple, see https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping. */
    const aliasPath = jsConfigFileContent.compilerOptions.paths[aliasName][0];

    // name --> path, key --> name
    aliases.push({ name: aliasPath, key: aliasName });
  }

  return aliases;
}

module.exports = getLevelAlias;
