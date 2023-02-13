const getAbsolutePathTo = require("./absolutePathTo");
const getModuleLevelByName = require("../serachByNameFolder/getModuleByName");
const getModuleLevel = require("./getModuleLevel");
const targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel = require("./targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel");
const getNearestName = require("./getNearestName");
module.exports = getParentLevelorForTargettLevelIfThereIsNoTargetLevelInConfigurationTree;

function getParentLevelorForTargettLevelIfThereIsNoTargetLevelInConfigurationTree({
  generalLevels,
  configurationTree,
  currentLevel,
  absolutePathToTargetModuleFolder,
  rootDirectory,
  pathToCurrentModule,
  importDefinitionPath,
}) {
  let targetLevel = getModuleLevel({
    generalLevels,
    path: absolutePathToTargetModuleFolder,
    configurationTree,
  });

  const levelsModuleIsRoorDirectory = Boolean(targetLevel.name === rootDirectory);
  const nearestModuleLevelName = getNearestName(targetLevel, currentLevel);

  if (levelsModuleIsRoorDirectory) {
    targetLevel = getModuleLevel({
      generalLevels,
      path: getAbsolutePathTo(pathToCurrentModule, importDefinitionPath),
      configurationTree,
    });
  }

  const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestModuleLevelName);
  const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(targetLevel, currentLevel);
  return {
    currentLevel: currentLevel,
    targetLevel: targetLevel,
    nearestGeneralLevel: nearestGeneralLevel,
    isOneLevelOfNesting: isOneLevelOfNesting,
  };
}
