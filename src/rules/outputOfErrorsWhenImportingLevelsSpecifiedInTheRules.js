const setModuleByName = require("./setModuleByName");

function outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
    currentModuleLevelConfiguration,
    configurationOfTargetModule,
    importLevel,
    currentModuleLevel,
    configurationTree
  ) {
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
        return `Cannot import ${importLevel} from ${currentModuleLevel}`;
      }
    } else if (currentModuleLevelConfiguration.firstParent !== configurationOfTargetModule.firstParent) {
      if (firstParentConfigurationOfTargetModule.index >= firstParentCurrentModuleLevelConfiguration.index) {
        return `aaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
      }
    }
  }

  module.exports = outputOfErrorsWhenImportingLevelsSpecifiedInTheRules