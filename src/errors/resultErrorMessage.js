const getDataForErrorDetection = require("../helpers/prepareDataForErrorOutput/getDataForErrorDetection");
module.exports = getResultErrorMessage;

function getResultErrorMessage({
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
  levelsConfigurationFile,
  levelsConfiguration,
}) {
  let errorMessage = undefined;

  const errorHandlingData = getDataForErrorDetection({
    importDefinitionPath,
    pathToCurrentModule,
    rootDirectory,
    levelsConfigurationFile,
    levelsConfiguration,
  });
  const { isOneLevelOfNesting, nearestGeneralLevel, targetModuleLevel, currentModuleLevel } = errorHandlingData;
  const nearestGeneralLevelExists = Boolean(nearestGeneralLevel);

  if (nearestGeneralLevelExists) {
    if (!isOneLevelOfNesting) {
      errorMessage = getErrorWhenCurrentAndTargetAreInTheSameLevel({
        childrenOfGeneralLevelWhereCurrentModuleLevelLocated: currentModuleLevel,
        childrenOfGeneralLevelWhereTargetModuleLevelLocated: targetModuleLevel,
        nearestGeneralLevel,
      });
    } else {
      errorMessage = getErrorWhenCurrentAndTargetModulesAreInDifferentLevels({
        childrenOfGeneralLevelWhereCurrentModuleLevelLocated: currentModuleLevel,
        childrenOfGeneralLevelWhereTargetModuleLevelLocated: targetModuleLevel,
      });
    }
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

function getErrorWhenCurrentAndTargetModulesAreInDifferentLevels({
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
