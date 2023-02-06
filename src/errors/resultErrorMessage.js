const searchNearestCurrentAndTargetLevel = require("../helpers/prepareDataForErrorOutput/searchNearestCurrentAndTargetLevel");
module.exports = resultErrorMessage;

function resultErrorMessage(
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
  levelsConfigurationFile,
  levelsConfiguration
) {
  let errorMessage = undefined;

  const errorHandlingData = searchNearestCurrentAndTargetLevel({
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

  console.log(errorHandlingData);

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
    errorMessage = `ddddddddddddd`;
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
    errorMessage = `Cannot import ${childrenOfGeneralLevelWhereCurrentModuleLevelLocated.name} from ${childrenOfGeneralLevelWhereTargetModuleLevelLocated.name}`;
  }

  return errorMessage;
}
