const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");

module.exports = getGeneralLevels;

/**
 * находим все общие уровни
 */
function getGeneralLevels(targetModulePath, currentModulePath) {
  const targetModulPathArr = targetModulePath.split("/");
  const currentModulePatharr = getPathToCurrentFileWithoutExtension(currentModulePath).split("/");
  const generalLevels = targetModulPathArr.filter((x) => currentModulePatharr.indexOf(x) !== -1);
  return generalLevels;
}
