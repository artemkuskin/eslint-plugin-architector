const getModuleLevelByName = require("../../serachByNameFolder/getModuleByName");
const getModuleLevel = require("../getModuleLevel");
const getNearestName = require("../getNearestName");
const targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel = require("../targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel");

module.exports = getParentLevelForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree;

function getParentLevelForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree({
  generalLevels,
  pathToCurrentModule,
  configurationTree,
  targetLevel,
}) {
  const currentLevel = getModuleLevel({
    generalLevels,
    path: pathToCurrentModule,
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
