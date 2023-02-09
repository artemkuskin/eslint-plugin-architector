const getDataForErrorDetection = require("../helpers/prepareDataForErrorOutput/searchNearestCurrentAndTargetLevel");
module.exports = resultErrorMessage;

function resultErrorMessage({
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

  const nearestGeneralLevel = errorHandlingData.nearestGeneralLevel;
  const nearestGeneralLevelExists = Boolean(nearestGeneralLevel);

  if (nearestGeneralLevelExists) {
  const childrenOfGeneralLevelWhereTargetModuleLevelLocated = errorHandlingData.targetModuleLevel;
  const childrenOfGeneralLevelWhereCurrentModuleLevelLocated = errorHandlingData.currentModuleLevel;
  const oneLevelOfNesting = errorHandlingData.isOneLevelOfNesting

  console.log(errorHandlingData);
    if (!oneLevelOfNesting) {
      errorMessage = getErrorWhenCurrentAndTargetAreInTheSameLevel({
        childrenOfGeneralLevelWhereCurrentModuleLevelLocated,
        childrenOfGeneralLevelWhereTargetModuleLevelLocated,
        nearestGeneralLevel,
      });
    } else {
      errorMessage = getErrorWhenCurrentAndTargetModulesAreInDifferentLevels({
        childrenOfGeneralLevelWhereCurrentModuleLevelLocated,
        childrenOfGeneralLevelWhereTargetModuleLevelLocated,
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
    errorMessage = `Target level is the parent level of the current level`;
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
