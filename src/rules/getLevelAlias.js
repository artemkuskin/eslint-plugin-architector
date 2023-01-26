const absolutePathToFile = require("./absolutePathToFile");
const PathToCurrentFileWithoutContent = require("./pathToCurrentFileWithoutContent");
const path = require("path");

function getLevelAlias(rootDirectory, jsConfigFileContent) {
  const parentsAlias = [];
  for (let key in jsConfigFileContent.compilerOptions.paths) {
    parentsAlias.push({ name: jsConfigFileContent.compilerOptions.paths[key].toString(), key: [key].toString() });
  }
  const configurationTreeAlias = [];
  for (let key in parentsAlias) {
    configurationTreeAlias.push({
      key: PathToCurrentFileWithoutContent(parentsAlias[key].key),
      path: path
        .resolve(
          parentsAlias[key].name.split("/").splice(0, parentsAlias[key].name.split("/").length).join("/"),
          rootDirectory
        )
        .split("/")
        .splice(
          0,
          absolutePathToFile(PathToCurrentFileWithoutContent(parentsAlias[key].name), rootDirectory).split("/").length -
            1
        )
        .join("/"),
    });
  }
  return configurationTreeAlias;
}

module.exports = getLevelAlias;
