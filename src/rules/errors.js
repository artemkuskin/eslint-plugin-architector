const errorWhenImportingLevelsNotIncludedInRules = require("./errorWhenImportingLevelsNotIncludedInRules");
const getLevelAlias = require("./getLevelAlias");
const outputOfErrorsWhenImportingLevelsSpecifiedInTheRules = require("./outputOfErrorsWhenImportingLevelsSpecifiedInTheRules");
const setCurrentLevel = require("./setCurrentLevel");
const setModuleByName = require("./setModuleByName");
module.exports = errors;

function errors(configurationTree, pathToCurrentModule, importDefinitionPath, rootDirectory, jsConfigFileContent) {
  const currentModuleLevel = setCurrentLevel(pathToCurrentModule);
  const importLevel = setCurrentLevel(importDefinitionPath);
  const currentModuleLevelConfiguration = setModuleByName(configurationTree, currentModuleLevel);
  const configurationOfTargetModule = setModuleByName(configurationTree, importLevel);
  const targetModuleAlias = setLevelByKey(
    getLevelAlias(rootDirectory, jsConfigFileContent),
    firstElemImportDefinitionPath(importDefinitionPath)
  );

  let errorMessage = undefined;
  if (configurationOfTargetModule && currentModuleLevelConfiguration) {
    errorMessage = outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
      currentModuleLevelConfiguration,
      configurationOfTargetModule,
      importLevel,
      currentModuleLevel,
      configurationTree,
      importDefinitionPath,
      pathToCurrentModule
    );
  } else {
    errorMessage = errorWhenImportingLevelsNotIncludedInRules(
      configurationTree,
      rootDirectory,
      pathToCurrentModule,
      importDefinitionPath,
      importLevel,
      currentModuleLevel,
      targetModuleAlias
    );
  }
  return errorMessage;
}

function firstElemImportDefinitionPath(importDefinitionPath) {
  return importDefinitionPath.split("/")[0];
}

function setLevelByKey(configurationTree, key) {
  return configurationTree.find((elem) => elem.key === key);
}
