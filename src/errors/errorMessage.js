const getDataForErrorDetection = require("../helpers/prepareDataForErrorOutput/getDataForErrorDetection");
module.exports = getErrorMessage;

/**
 * currentModuleLevel -> currentLevel
 * targetModuleLevel -> targetLevel
 * nearestGeneralLevel -> nearestGeneralLevel
 * 
 */

function getErrorMessage({
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
  levelsConfigurationFile,
  levelsConfiguration,
}) {
  let errorMessage = undefined;

  const errorDetectionData = getDataForErrorDetection({
    importDefinitionPath,
    pathToCurrentModule,
    rootDirectory,
    levelsConfigurationFile,
    levelsConfiguration,
  });
  const { isOneLevelOfNesting, nearestGeneralLevel, targetLevel, currentLevel } = errorDetectionData;
  const nearestGeneralLevelExists = Boolean(nearestGeneralLevel);

  if (nearestGeneralLevelExists) {
    if (isOneLevelOfNesting) {
      errorMessage = getErrorWhenCurrentAndTargetAreInDifferentLevels({
        childrenOfGeneralLevelWhereCurrentModuleLevelLocated: currentLevel,
        childrenOfGeneralLevelWhereTargetModuleLevelLocated: targetLevel,
      });
      
    } else {
      errorMessage = getErrorWhenCurrentAndTargetAreInTheSameLevel({
        childrenOfGeneralLevelWhereCurrentModuleLevelLocated: currentLevel,
        childrenOfGeneralLevelWhereTargetModuleLevelLocated: targetLevel,
        nearestGeneralLevel,
      });
    }
  }

  return errorMessage;
}

function getErrorWhenCurrentAndTargetAreInDifferentLevels({
  childrenOfGeneralLevelWhereCurrentModuleLevelLocated,
  childrenOfGeneralLevelWhereTargetModuleLevelLocated,
}) {
  const currentModuleLevelAboveTargetModuleLevel =
    childrenOfGeneralLevelWhereCurrentModuleLevelLocated.index <
    childrenOfGeneralLevelWhereTargetModuleLevelLocated.index;

  let errorMessage = undefined;

  if (currentModuleLevelAboveTargetModuleLevel) {
    errorMessage = `It is not advisable to ${childrenOfGeneralLevelWhereTargetModuleLevelLocated.name} in ${childrenOfGeneralLevelWhereCurrentModuleLevelLocated.name}, since level ${childrenOfGeneralLevelWhereCurrentModuleLevelLocated.name} is higher than level ${childrenOfGeneralLevelWhereTargetModuleLevelLocated.name} in the rules`;
  }

  return errorMessage;
}


function getErrorWhenCurrentAndTargetAreInTheSameLevel({
  childrenOfGeneralLevelWhereCurrentModuleLevelLocated,
  childrenOfGeneralLevelWhereTargetModuleLevelLocated,
  nearestGeneralLevel,
}) {
  let errorMessage = undefined;

  const tagetModuleLevelIsNearestGeneralLevel =
    childrenOfGeneralLevelWhereTargetModuleLevelLocated.architectorPath === nearestGeneralLevel.architectorPath;
  const currentModuleLevelIsNotNearestLevel =
    childrenOfGeneralLevelWhereCurrentModuleLevelLocated.architectorPath !== nearestGeneralLevel.architectorPath;
  const currentModuleLevelImportsItsParentLevel =
    tagetModuleLevelIsNearestGeneralLevel && currentModuleLevelIsNotNearestLevel;

  if (currentModuleLevelImportsItsParentLevel) {
    errorMessage = "Target level is the parent level of the current level";
  }

  return errorMessage;
}

