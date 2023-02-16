const getModuleLevelByName = require("../../serachByNameFolder/getModuleByName");
const getModuleLevel = require("../moduleLevel/getModuleLevel");
const targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel = require("../targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel");
const getNearestName = require("../moduleName/getNearestName");
module.exports = getParentLevelForTargettLevelIfThereIsNoTargetLevelInConfigurationTree;

function getParentLevelForTargettLevelIfThereIsNoTargetLevelInConfigurationTree({
  generalLevels,
  configurationTree,
  currentLevel,
  absolutePathToTargetModuleFolder,
  rootDirectory,
  absolutePathToTargetModule,
}) {
  let targetLevel = getModuleLevel({
    generalLevels,
    path: absolutePathToTargetModuleFolder,
    configurationTree,
  });

  const levelsModuleIsRoorDirectory = Boolean(targetLevel.name === rootDirectory);

  if (levelsModuleIsRoorDirectory) {
    targetLevel = getModuleLevel({
      generalLevels,
      path: absolutePathToTargetModule,
      configurationTree,
    });
  }

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
