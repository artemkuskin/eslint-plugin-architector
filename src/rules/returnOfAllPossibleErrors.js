const errorWhenImportingLevelsNotIncludedInRules = require("../errors/errorsWhenImportingLevelsNotIncludedInRules");
const getLevelAlias = require("../helpers/getLevelAlias");
const errorsWhenImportingLevelsSpecifiedInTheRules = require("../errors/errorsWhenImportingLevelsSpecifiedInTheRules");
const setCurrentLevel = require("../helpers/setCurrentLevel");
const setModuleByName = require("../helpers/setModuleByName");
const absolutePathToFile = require("../helpers/absolutePathToFile");
const PathToCurrentFileWithOutContent = require("../helpers/pathToCurrentFileWithoutContent");
const test = require("../searchNearestCurrentAndTargetLevel");
const getArchitectureConfigurationTree = require("../helpers/getArchitectureConfigurationTree");
module.exports = returnOfAllPossibleErrors;

function returnOfAllPossibleErrors(
  rootDirectory,
  importDefinitionPath,
  pathToCurrentModule,
  levelsConfiguration,
  jsConfigFileContent
) {
   const currentModuleLevel = setCurrentLevel(pathToCurrentModule);
   const configurationTree = getArchitectureConfigurationTree(
    levelsConfiguration.file,
    levelsConfiguration,
    rootDirectory
  );
  let errorMessage = undefined;

  if (currentModuleLevel) {
    errorMessage = errorsWhenImportingLevelsSpecifiedInTheRules(
      configurationTree,
      importDefinitionPath,
      pathToCurrentModule,
      rootDirectory,
      jsConfigFileContent
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
