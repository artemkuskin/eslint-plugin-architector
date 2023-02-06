const absolutePathToFile = require("../convertPath/absolutePathToFile");
const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");
module.exports = absolutePathTo

function absolutePathTo(pathToModule, importDefinitionPath) {
    return absolutePathToFile(getPathToCurrentFileWithoutExtension(pathToModule), importDefinitionPath);
  }