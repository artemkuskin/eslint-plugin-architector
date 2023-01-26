const errorWhenImportingLevelsNotIncludedInRules = require("./errorWhenImportingLevelsNotIncludedInRules");
const outputOfErrorsWhenImportingLevelsSpecifiedInTheRules = require("./outputOfErrorsWhenImportingLevelsSpecifiedInTheRules")
const setCurrentLevel = require("./setCurrentLevel");
const setModuleByName = require("./setModuleByName");

function errorIfNotAlias(configurationTree, pathToCurrentModule, importDefinitionPath, rootDirectory,targetModuleAlias) {
    const currentModuleLevel = setCurrentLevel(pathToCurrentModule);
    const importLevel = setCurrentLevel(importDefinitionPath);
    const currentModuleLevelConfiguration = setModuleByName(configurationTree, currentModuleLevel);
    const configurationOfTargetModule = setModuleByName(configurationTree, importLevel);
    if (configurationOfTargetModule && currentModuleLevelConfiguration) {
      return outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
        currentModuleLevelConfiguration,
        configurationOfTargetModule,
        importLevel,
        currentModuleLevel,
        configurationTree
      );
    } else {
      return errorWhenImportingLevelsNotIncludedInRules(
        configurationTree,
        rootDirectory,
        pathToCurrentModule,
        importDefinitionPath,
        importLevel,
        currentModuleLevel,
        targetModuleAlias
      );
    }
  }

  module.exports = errorIfNotAlias
  