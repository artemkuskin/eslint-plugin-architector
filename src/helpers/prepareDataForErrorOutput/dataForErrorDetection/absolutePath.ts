const absolutePathToFile = require("../../convertPath/absolutePathToFile");
const getPathToCurrentFileWithoutExtension = require("../../convertPath/pathToCurrentFileWithoutContent");
module.exports = getAbsolutePathTo;

function getAbsolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(getPathToCurrentFileWithoutExtension(pathToModule), importDefinitionPath);
  // .split("\\")
  // .join("/");
}
