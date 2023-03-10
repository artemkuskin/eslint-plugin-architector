const getModuleLevelByName = require("../../serachByNameFolder/getModuleByName");
const getFolderName = require("../../serachByNameFolder/getNameFolder");
const getGeneralLevels = require("../generalLevel/getGeneralLevels");
const getCurrentAndTargetFolderName = require("../moduleName/getCurrentAndTargetFolderName");
const targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel = require("../dataForErrorDetection/targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel");
const getNearestName = require("../moduleName/getNearestName");
const getParentLevelForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree = require("./getParentLevelForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree");
const getParentLevelForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree = require("./getParentLevelForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree");
const getParentLevelForTargettLevelIfThereIsNoTargetLevelInConfigurationTree = require("./getParentLevelForTargettLevelIfThereIsNoTargetLevelInConfigurationTree");
module.exports = getDataAboutTheCurrentLevelAndTargetLevel;

function getDataAboutTheCurrentLevelAndTargetLevel({
  pathToCurrentModule,
  configurationTree,
  absolutePathToTargetLevel,
  rootDirectory,
}) {
  const { absolutePathToTargetModuleFolder, absolutePathToTargetModule } = absolutePathToTargetLevel;
  const rootDirectoryTargetLevelExists = Boolean(getFolderName(rootDirectory, absolutePathToTargetModuleFolder));
  if (rootDirectoryTargetLevelExists) {
    const generalLevels = getGeneralLevels(absolutePathToTargetModuleFolder, pathToCurrentModule);
    const modulesLevelName = getCurrentAndTargetFolderName({
      generalLevels,
      pathToCurrentModule,
      absolutePathToTargetModuleFolder,
    });
    const targetLevel = getModuleLevelByName(configurationTree, modulesLevelName.targetName);
    const currentLevel = getModuleLevelByName(configurationTree, modulesLevelName.currentName);
    const nearestModuleLevelName = getNearestName(targetLevel, currentLevel, rootDirectory);
    const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestModuleLevelName);
    const currentModuleLevelNotSpecifiedInTheRules = Boolean(currentLevel === undefined);
    const targetModuleLevelNotSpecifiedInTheRules = Boolean(targetLevel === undefined);
    const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(targetLevel, currentLevel);

    if (currentModuleLevelNotSpecifiedInTheRules && targetModuleLevelNotSpecifiedInTheRules) {
      return getParentLevelForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree({
        generalLevels,
        pathToCurrentModule,
        configurationTree,
        absolutePathToTargetModuleFolder,
      });
    }

    if (currentModuleLevelNotSpecifiedInTheRules) {
      return getParentLevelForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree({
        generalLevels,
        pathToCurrentModule,
        configurationTree,
        targetLevel,
      });
    }

    if (targetModuleLevelNotSpecifiedInTheRules) {
      return getParentLevelForTargettLevelIfThereIsNoTargetLevelInConfigurationTree({
        generalLevels,
        configurationTree,
        currentLevel,
        absolutePathToTargetModuleFolder,
        rootDirectory,
        absolutePathToTargetModule,
      });
    }

    return {
      currentLevel: currentLevel,
      targetLevel: targetLevel,
      nearestGeneralLevel: nearestGeneralLevel,
      isOneLevelOfNesting: isOneLevelOfNesting,
    };
  }
  return {
    currentLevel: undefined,
    targetLevel: undefined,
    nearestGeneralLevel: undefined,
    isOneLevelOfNesting: undefined,
  };
}
