const path = require("path");
module.exports = absolutePathToFile;

function absolutePathToFile(pathToCurrentModule, importDefinitionPath) {
  return path.resolve(pathToCurrentModule, importDefinitionPath).split("\\").join("/"); //тут изменил
}
