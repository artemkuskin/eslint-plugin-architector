const getDataForErrorDetection = require("../helpers/prepareDataForErrorOutput/dataForErrorDetection/getDataForErrorDetection");
module.exports = getErrorMessage;

function getErrorMessage({
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
  levelsConfigurationFile,
  levelsConfiguration,
  errorPostfix,
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
  const errorPost = errorPostfix ? errorPostfix : ".";

  if (nearestGeneralLevelExists) {
    if (isOneLevelOfNesting) {
      errorMessage = getErrorWhenCurrentAndTargetAreInDifferentLevels({
        childrenOfGeneralLevelWhereCurrentLevelLocated: currentLevel,
        childrenOfGeneralLevelWhereTargetLevelLocated: targetLevel,
        nearestGeneralLevel,
        errorPost,
      });
    } else {
      errorMessage = getErrorWhenCurrentAndTargetAreInTheSameLevel({
        childrenOfGeneralLevelWhereCurrentLevelLocated: currentLevel,
        childrenOfGeneralLevelWhereTargetLevelLocated: targetLevel,
        nearestGeneralLevel,
        errorPost,
      });
    }
  }

  return errorMessage;
}

function getErrorWhenCurrentAndTargetAreInDifferentLevels({
  childrenOfGeneralLevelWhereCurrentLevelLocated,
  childrenOfGeneralLevelWhereTargetLevelLocated,
  nearestGeneralLevel,
  errorPost,
}) {
  if (nearestGeneralLevel.independentChildren === true) {
    return;
  }

  const currentModuleLevelAboveTargetModuleLevel =
    childrenOfGeneralLevelWhereCurrentLevelLocated.index < childrenOfGeneralLevelWhereTargetLevelLocated.index;

  let errorMessage = undefined;

  if (currentModuleLevelAboveTargetModuleLevel) {
    errorMessage = `Cannot import module of level ${childrenOfGeneralLevelWhereTargetLevelLocated.name} into module of level ${childrenOfGeneralLevelWhereCurrentLevelLocated.name}. Reason: level ${childrenOfGeneralLevelWhereTargetLevelLocated.name} is higher than level ${childrenOfGeneralLevelWhereCurrentLevelLocated.name} inside of ${nearestGeneralLevel.name}. ${errorPost}`;
  }

  return errorMessage;
}

function getErrorWhenCurrentAndTargetAreInTheSameLevel({
  childrenOfGeneralLevelWhereCurrentLevelLocated,
  childrenOfGeneralLevelWhereTargetLevelLocated,
  nearestGeneralLevel,
  errorPost,
}) {
  let errorMessage = undefined;

  const tagetModuleLevelIsNearestGeneralLevel =
    childrenOfGeneralLevelWhereTargetLevelLocated.architectorPath === nearestGeneralLevel.architectorPath;
  const currentModuleLevelIsNotNearestLevel =
    childrenOfGeneralLevelWhereCurrentLevelLocated.architectorPath !== nearestGeneralLevel.architectorPath;
  const currentModuleLevelImportsItsParentLevel =
    tagetModuleLevelIsNearestGeneralLevel && currentModuleLevelIsNotNearestLevel;

  if (currentModuleLevelImportsItsParentLevel) {
    errorMessage = `Cannot import module of level ${childrenOfGeneralLevelWhereTargetLevelLocated.name} into module of level ${childrenOfGeneralLevelWhereCurrentLevelLocated.name}. Reason: level ${childrenOfGeneralLevelWhereTargetLevelLocated.name} is parent of level ${childrenOfGeneralLevelWhereCurrentLevelLocated.name} ${errorPost}`;
  }

  return errorMessage;
}
