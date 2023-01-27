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
    return outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
      currentModuleLevelConfiguration,
      configurationOfTargetModule,
      importLevel,
      currentModuleLevel,
      configurationTree,
      importDefinitionPath,
      pathToCurrentModule
    );
  }
  return errorWhenImportingLevelsNotIncludedInRules(
    configurationTree,
    rootDirectory,
    pathToCurrentModule,
    importDefinitionPath,
    importLevel,
    currentModuleLevel,
    targetModuleAlias
  );
  //return errorMessage
}

