const setModuleByName = require("./setModuleByName");
module.exports = outputOfErrorsWhenImportingLevelsSpecifiedInTheRules;

function outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
  currentModuleLevelConfiguration,
  configurationOfTargetModule,
  importLevel,
  currentModuleLevel,
  configurationTree,
  targetLevelAlias
) {
  let errorMessage = undefined;
  const firstParentCurrentModuleLevelConfiguration = setModuleByName(
    configurationTree,
    currentModuleLevelConfiguration.firstParent
  );
  const firstParentConfigurationOfTargetModule = setModuleByName(
    configurationTree,
    configurationOfTargetModule.firstParent
  );
  if (
    currentModuleLevelConfiguration.parents === configurationOfTargetModule.parents &&
    configurationOfTargetModule.index >= currentModuleLevelConfiguration.index
  ) {
    return `Cannot import ${importLevel} from ${currentModuleLevel}`;
  }
  if (
    currentModuleLevelConfiguration.firstParent !== configurationOfTargetModule.firstParent &&
    firstParentConfigurationOfTargetModule.index >= firstParentCurrentModuleLevelConfiguration.index
  ) {
    return `aaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
  }
  //return errorMessage
}

