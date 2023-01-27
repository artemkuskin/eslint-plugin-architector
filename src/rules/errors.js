const errorWhenImportingLevelsNotIncludedInRules = require("./errorWhenImportingLevelsNotIncludedInRules");
const outputOfErrorsWhenImportingLevelsSpecifiedInTheRules = require("./outputOfErrorsWhenImportingLevelsSpecifiedInTheRules");
const setCurrentLevel = require("./setCurrentLevel");
const setModuleByName = require("./setModuleByName");
module.exports = errors;

function errors(configurationTree, pathToCurrentModule, importDefinitionPath, rootDirectory, targetModuleAlias) {
  const currentModuleLevel = setCurrentLevel(pathToCurrentModule);
  const importLevel = setCurrentLevel(importDefinitionPath);
  const currentModuleLevelConfiguration = setModuleByName(configurationTree, currentModuleLevel);
  const configurationOfTargetModule = setModuleByName(configurationTree, importLevel);
  let errorMessage = undefined 
  if (configurationOfTargetModule && currentModuleLevelConfiguration) {
    errorMessage = outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
      currentModuleLevelConfiguration,
      configurationOfTargetModule,
      importLevel,
      currentModuleLevel,
      configurationTree,
      targetModuleAlias
    );
  }
  errorMessage = errorWhenImportingLevelsNotIncludedInRules(
    configurationTree,
    rootDirectory,
    pathToCurrentModule,
    importDefinitionPath,
    importLevel,
    currentModuleLevel,
    targetModuleAlias
  );
  return errorMessage
}

