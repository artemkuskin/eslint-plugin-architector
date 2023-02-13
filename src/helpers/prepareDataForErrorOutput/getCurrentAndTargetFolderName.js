const getLowestGeneralLevel = require("./getLowestGeneralLevel");
const setNameModuleLevel = require("../serachByNameFolder/getNameFolder");
const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");
module.exports = getCurrentAndTargetFolderName;
/**
 * находим текущий и целеыой уровни по первому общему эелементу
 */
function getCurrentAndTargetFolderName({ generalLevels, pathToCurrentModule, absolutePathToTargetModuleFolder }) {
  const current = setNameModuleLevel(
    getLowestGeneralLevel(generalLevels),
    getPathToCurrentFileWithoutExtension(pathToCurrentModule)
  );
  const target = setNameModuleLevel(getLowestGeneralLevel(generalLevels), absolutePathToTargetModuleFolder);
  return { currentName: current, targetName: target };
}
