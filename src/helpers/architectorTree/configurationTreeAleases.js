const absolutePathToFile = require("../convertPath/absolutePathToFile");
const PathToCurrentFileWithOutContent = require("../convertPath/pathToCurrentFileWithoutContent");
module.exports = getAliasesList;

function getAliasesList(rootDirectory, jsConfigAliases) {
  if (jsConfigAliases) {
    const configurationTreeAlias = [];
    const aliases = getAliases(jsConfigAliases);
    for (let aliase of aliases) {
      const keyAliase = PathToCurrentFileWithOutContent(aliase.name);
      const pathAliase = absolutePathToAliasesByKey(aliase, rootDirectory);
      configurationTreeAlias.push({
        key: keyAliase,
        path: pathAliase,
      });
    }
    return configurationTreeAlias;
  }
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

function getAliases(jsConfigAliases) {
  const aliases = [];

  for (let aliasName in jsConfigAliases) {
    /* We access first element of array, because for now we support only aliases with one value. It can be multiple, see https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping. */
    const aliasPath = jsConfigAliases[aliasName][0];
    aliases.push({ path: aliasPath, name: aliasName });
  }

  return aliases;
}
