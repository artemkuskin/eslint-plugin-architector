const getModuleLevelByName = require("../serachByNameFolder/getModuleByName");
const getModuleLevel = require("./getModuleLevel");
const getNearestName = require("./getNearestName");
const targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel = require("./targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel");

module.exports = getParentLevelorForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree;

function getParentLevelorForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree({
  generalLevels,
  pathToCurrentModule,
  configurationTree,
  targetLevel,
}) {
  let currentLevel = getModuleLevel({
    generalLevels,
    path: pathToCurrentModule,
    configurationTree,
  });

  const nearestModuleLevelName = getNearestName(targetLevel, currentLevel);
  const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestModuleLevelName);
  const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(targetLevel, currentLevel);

  return {
    currentLevel: currentLevel,
    targetLevel: targetLevel,
    nearestGeneralLevel: nearestGeneralLevel,
    isOneLevelOfNesting: isOneLevelOfNesting,
  };
}
