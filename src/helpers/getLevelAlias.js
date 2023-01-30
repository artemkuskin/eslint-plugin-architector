const absolutePathToFile = require("./absolutePathToFile");
const PathToCurrentFileWithOutContent = require("./pathToCurrentFileWithoutContent");
// const path = require("path");
module.exports = getLevelAlias;

function getLevelAlias(rootDirectory, jsConfigFileContent) {
  const aliases = getAliases(jsConfigFileContent);
  const configurationTreeAlias = [];
  for (let key in aliases) {
    configurationTreeAlias.push({
      key: PathToCurrentFileWithOutContent(aliases[key].name),
      path: absolutePathToAliasesByKey(aliases[key], rootDirectory),
    });
  }
  return configurationTreeAlias;
}

function setLengthPathFolder(pathFolder) {
  return pathFolder.split("/").length - 1;
}

function setPathAliases(pathAlias) {
  return pathAlias.split("/").splice(0, setLengthPathFolder(pathAlias)).join("/");
}

function absolutePathToAliasesByKey(aliases, rootDirectory) {
  const lengthStringAliases = setLengthPathFolder(
    absolutePathToFile(PathToCurrentFileWithOutContent(aliases.path), rootDirectory)
  );
  return absolutePathToFile(setPathAliases(aliases.path), rootDirectory)
    .split("/")
    .splice(0, lengthStringAliases)
    .join("/");
}

function getAliases(jsConfigFileContent) {
  const aliases = [];

  for (let aliasName in jsConfigFileContent.compilerOptions.paths) {
    /* We access first element of array, because for now we support only aliases with one value. It can be multiple, see https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping. */
    const aliasPath = jsConfigFileContent.compilerOptions.paths[aliasName][0];
    aliases.push({ path: aliasPath, name: aliasName });
  }

  return aliases;
}

