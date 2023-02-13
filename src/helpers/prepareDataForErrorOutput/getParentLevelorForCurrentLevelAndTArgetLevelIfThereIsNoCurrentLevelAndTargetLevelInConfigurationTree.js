const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");
const getModuleLevelByName = require("../serachByNameFolder/getModuleByName");
const getModuleLevel = require("./getModuleLevel");
const getNearestName = require("./getNearestName");
const targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel = require("./targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel");
module.exports = getParentLevelorForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree;

function getParentLevelorForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree({
  generalLevels,
  pathToCurrentModule,
  configurationTree,
  absolutePathToTargetModuleFolder,
}) {
  const currentLevel = getModuleLevel({
    generalLevels,
    path: getPathToCurrentFileWithoutExtension(pathToCurrentModule),
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
