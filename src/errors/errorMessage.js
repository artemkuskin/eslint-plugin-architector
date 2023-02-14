const getDataForErrorDetection = require("../helpers/prepareDataForErrorOutput/getDataForErrorDetection");
module.exports = getErrorMessage;

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
        childrenOfGeneralLevelWhereCurrentLevelLocated: currentLevel,
        childrenOfGeneralLevelWhereTargetLevelLocated: targetLevel,
        nearestGeneralLevel,
      });
    } else {
      errorMessage = getErrorWhenCurrentAndTargetAreInTheSameLevel({
        childrenOfGeneralLevelWhereCurrentLevelLocated: currentLevel,
        childrenOfGeneralLevelWhereTargetLevelLocated: targetLevel,
        nearestGeneralLevel,
      });
    }
  }

  return errorMessage;
}

function getErrorWhenCurrentAndTargetAreInDifferentLevels({
  childrenOfGeneralLevelWhereCurrentLevelLocated,
  childrenOfGeneralLevelWhereTargetLevelLocated,
  nearestGeneralLevel,
}) {
  if (nearestGeneralLevel.independentChildren === true) {
    return;
  }

  const currentModuleLevelAboveTargetModuleLevel =
    childrenOfGeneralLevelWhereCurrentLevelLocated.index < childrenOfGeneralLevelWhereTargetLevelLocated.index;

  let errorMessage = undefined;

  if (currentModuleLevelAboveTargetModuleLevel) {
    errorMessage = `It is not advisable to ${childrenOfGeneralLevelWhereTargetLevelLocated.name} in ${childrenOfGeneralLevelWhereCurrentLevelLocated.name}, since level ${childrenOfGeneralLevelWhereCurrentLevelLocated.name} is higher than level ${childrenOfGeneralLevelWhereTargetLevelLocated.name} in the rules`;
  }

  return errorMessage;
}

function getErrorWhenCurrentAndTargetAreInTheSameLevel({
  childrenOfGeneralLevelWhereCurrentLevelLocated,
  childrenOfGeneralLevelWhereTargetLevelLocated,
  nearestGeneralLevel,
}) {
  let errorMessage = undefined;

  const tagetModuleLevelIsNearestGeneralLevel =
    childrenOfGeneralLevelWhereTargetLevelLocated.architectorPath === nearestGeneralLevel.architectorPath;
  const currentModuleLevelIsNotNearestLevel =
    childrenOfGeneralLevelWhereCurrentLevelLocated.architectorPath !== nearestGeneralLevel.architectorPath;
  const currentModuleLevelImportsItsParentLevel =
    tagetModuleLevelIsNearestGeneralLevel && currentModuleLevelIsNotNearestLevel;

  if (currentModuleLevelImportsItsParentLevel) {
    errorMessage = "Target level is the parent level of the current level";
  }

  return errorMessage;
}
