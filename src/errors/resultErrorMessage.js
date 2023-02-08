const dataForErrorDetection = require("../helpers/prepareDataForErrorOutput/searchNearestCurrentAndTargetLevel");
module.exports = resultErrorMessage;

function resultErrorMessage({
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
  levelsConfigurationFile,
  levelsConfiguration,
}) {
  let errorMessage = undefined;

  const errorHandlingData = dataForErrorDetection({
    importDefinitionPath,
    pathToCurrentModule,
    rootDirectory,
    levelsConfigurationFile,
    levelsConfiguration,
  });

  const nearestGeneralLevel = errorHandlingData.nearestGeneralLevel;
  const childrenOfGeneralLevelWhereTargetModuleLevelLocated = errorHandlingData.targetModuleLevel;
  const childrenOfGeneralLevelWhereCurrentModuleLevelLocated = errorHandlingData.currentModuleLevel;

  const nearestGeneralLevelExists = Boolean(nearestGeneralLevel);

  if (nearestGeneralLevelExists) {
    const currentAndTargetModulesLevelsAreInTheSameLevel =
      childrenOfGeneralLevelWhereCurrentModuleLevelLocated.name ===
      childrenOfGeneralLevelWhereTargetModuleLevelLocated.name;

    if (currentAndTargetModulesLevelsAreInTheSameLevel) {
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
    childrenOfGeneralLevelWhereTargetModuleLevelLocated.path === nearestGeneralLevel.path;
  const currentModuleLevelIsNotNearestLevel =
    childrenOfGeneralLevelWhereCurrentModuleLevelLocated.path !== nearestGeneralLevel.path;
  const currentModuleLevelImportsItsParentLevel =
    tagetModuleLevelIsNearestGeneralLevel && currentModuleLevelIsNotNearestLevel;

  if (currentModuleLevelImportsItsParentLevel) {
    errorMessage = `Target Level Is The parent Level Of The Curent Level`;
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
    errorMessage = `It Is Not Advisable To ${childrenOfGeneralLevelWhereTargetModuleLevelLocated.name} in ${childrenOfGeneralLevelWhereCurrentModuleLevelLocated.name}, Since Level ${childrenOfGeneralLevelWhereCurrentModuleLevelLocated.name} Is Higher Than Level ${childrenOfGeneralLevelWhereTargetModuleLevelLocated.name} In The Rules`;
  }

  return errorMessage;
}
