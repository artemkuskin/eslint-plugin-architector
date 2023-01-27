const setModuleByName = require("./setModuleByName");
module.exports = outputOfErrorsWhenImportingLevelsSpecifiedInTheRules

function outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
    currentModuleLevelConfiguration,
    configurationOfTargetModule,
    importLevel,
    currentModuleLevel,
    configurationTree,
    targetLevelAlias
  ) {
    let errorMessage = undefined
    const firstParentCurrentModuleLevelConfiguration = setModuleByName(
      configurationTree,
      currentModuleLevelConfiguration.firstParent
    );
    const firstParentConfigurationOfTargetModule = setModuleByName(
      configurationTree,
      configurationOfTargetModule.firstParent
    );
    if (currentModuleLevelConfiguration.parents === configurationOfTargetModule.parents) {
      if (configurationOfTargetModule.index >= currentModuleLevelConfiguration.index) {
        errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
      }
    } 
    if (currentModuleLevelConfiguration.firstParent !== configurationOfTargetModule.firstParent) {
      if (firstParentConfigurationOfTargetModule.index >= firstParentCurrentModuleLevelConfiguration.index) {
        errorMessage = `aaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
      }
    }
    return errorMessage
  }
