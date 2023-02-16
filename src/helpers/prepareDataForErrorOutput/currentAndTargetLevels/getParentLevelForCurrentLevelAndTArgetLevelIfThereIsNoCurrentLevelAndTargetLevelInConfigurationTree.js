const getPathToCurrentFileWithoutExtension = require("../../convertPath/pathToCurrentFileWithoutContent");
const getModuleLevelByName = require("../../serachByNameFolder/getModuleByName");
const getModuleLevel = require("../moduleLevel/getModuleLevel");
const getNearestName = require("../moduleName/getNearestName");
const targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel = require("../dataForErrorDetection/targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel");
module.exports = getParentLevelForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree;

function getParentLevelForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree({
  generalLevels,
  pathToCurrentModule,
  configurationTree,
  absolutePathToTargetModuleFolder,
}) {
  const pathToCurrentFolder = getPathToCurrentFileWithoutExtension(pathToCurrentModule);
  const currentLevel = getModuleLevel({
    generalLevels,
    path: pathToCurrentFolder,
    configurationTree,
  });

  const targetLevel = getModuleLevel({
    generalLevels,
    path: absolutePathToTargetModuleFolder, //getAbsolutePathTo(pathToCurrentModule, importDefinitionPath),
    configurationTree,
  });

  const nearestLevelName = getNearestName(targetLevel, currentLevel);
  const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestLevelName);
  const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(targetLevel, currentLevel);
  return {
    currentLevel: currentLevel,
    targetLevel: targetLevel,
    nearestGeneralLevel: nearestGeneralLevel,
    isOneLevelOfNesting: isOneLevelOfNesting,
  };
}
