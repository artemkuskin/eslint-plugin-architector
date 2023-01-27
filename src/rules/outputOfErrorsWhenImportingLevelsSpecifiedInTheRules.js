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
  errorMessage = setErrorsWithEqualParents(currentModuleLevelConfiguration, configurationOfTargetModule);
  errorMessage = setErrorsWithNotEquilFirstParetnt(
    currentModuleLevelConfiguration,
    configurationOfTargetModule,
    firstParentConfigurationOfTargetModule,
    firstParentCurrentModuleLevelConfiguration
  );
  return errorMessage
}

function setErrorsWithEqualParents(currentModuleLevelConfiguration, configurationOfTargetModule) {
  if (
    currentModuleLevelConfiguration.parents === configurationOfTargetModule.parents &&
    configurationOfTargetModule.index >= currentModuleLevelConfiguration.index
  ) {
    return `Cannot import ${importLevel} from ${currentModuleLevel}`;
  }
}

function setErrorsWithNotEquilFirstParetnt(
  currentModuleLevelConfiguration,
  configurationOfTargetModule,
  firstParentConfigurationOfTargetModule,
  firstParentCurrentModuleLevelConfiguration
) {
  if (
    currentModuleLevelConfiguration.firstParent !== configurationOfTargetModule.firstParent &&
    firstParentConfigurationOfTargetModule.index >= firstParentCurrentModuleLevelConfiguration.index
  ) {
    return `aaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
  }
}
