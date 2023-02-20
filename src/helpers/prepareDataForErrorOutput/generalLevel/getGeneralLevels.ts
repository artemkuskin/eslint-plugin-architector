const getPathToCurrentFileWithoutExtension = require("../../convertPath/pathToCurrentFileWithoutContent");

module.exports = getGeneralLevels;
/**
 * находим все общие уровни
 */
function getGeneralLevels(targetModulePath, currentModulePath) {
  const targetLevelPath = targetModulePath.split("/");
  const currentLevelPath = getPathToCurrentFileWithoutExtension(currentModulePath).split("/");
  const generalLevels = targetLevelPath.filter((x) => currentLevelPath.indexOf(x) !== -1);

  return generalLevels;
}
