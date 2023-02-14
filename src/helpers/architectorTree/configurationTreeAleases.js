const absolutePathToFile = require("../convertPath/absolutePathToFile");
const getPathToFileWithOutContent = require("../convertPath/pathToCurrentFileWithoutContent");
module.exports = getAliasesList;

function getAliasesList(rootDirectory, jsConfigAliases) {
  if (jsConfigAliases) {
    const configurationTreeAlias = [];
    const aliases = getAliases(jsConfigAliases);

    for (let aliase of aliases) {
      const keyAliase = getPathToFileWithOutContent(aliase.name);
      const pathAliase = getPathToAliase(aliase, rootDirectory);
      configurationTreeAlias.push({
        key: keyAliase,
        path: pathAliase,
      });
    }
    return configurationTreeAlias;
  }
}

function getPathToAliase(aliases, rootDirectory) {
  const lengthStringAliases = setLengthPathFolder(
    absolutePathToFile(getPathToFileWithOutContent(aliases.path), rootDirectory)
  );
  const pathToAliase = absolutePathToAliase(aliases, rootDirectory, lengthStringAliases);

  return pathToAliase;
}

function getAliases(jsConfigAliases) {
  const aliases = [];
  /* We access first element of array, because for now we support only aliases with one value. It can be multiple, see https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping. */
  for (let aliasName in jsConfigAliases) {
    const aliasPath = jsConfigAliases[aliasName][0];
    aliases.push({ path: aliasPath, name: aliasName });
  }

  return aliases;
}

function absolutePathToAliase(aliases, rootDirectory, lengthStringAliases) {
  return absolutePathToFile(getPathToFileWithOutContent(aliases.path), rootDirectory)
    .split("/")
    .splice(0, lengthStringAliases)
    .join("/");
}

function setLengthPathFolder(pathFolder) {
  return pathFolder.split("/").length - 1;
}
