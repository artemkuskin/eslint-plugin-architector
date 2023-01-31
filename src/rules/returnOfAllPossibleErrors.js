const errorWhenImportingLevelsNotIncludedInRules = require("../errors/errorsWhenImportingLevelsNotIncludedInRules");
const getLevelAlias = require("../helpers/getLevelAlias");
const errorsWhenImportingLevelsSpecifiedInTheRules = require("../errors/errorsWhenImportingLevelsSpecifiedInTheRules");
const setCurrentLevel = require("../helpers/setCurrentLevel");
const setModuleByName = require("../helpers/setModuleByName");
const absolutePathToFile = require("../helpers/absolutePathToFile");
const PathToCurrentFileWithOutContent = require("../helpers/pathToCurrentFileWithoutContent");
const test = require("../preparingElementsForComparison");
module.exports = returnOfAllPossibleErrors;

function returnOfAllPossibleErrors(
  configurationTree,
  pathToCurrentModule,
  importDefinitionPath,
  rootDirectory,
  jsConfigFileContent
) {
   const currentModuleLevel = setCurrentLevel(pathToCurrentModule);
  // const importLevel = setCurrentLevel(importDefinitionPath);

  // const currentLevelConfiguration = setModuleByName(configurationTree, currentModuleLevel);
  // const configurationOfTargetModule = setModuleByName(configurationTree, importLevel);

  // const targetModuleAlias = setLevelByKey(
  //   getLevelAlias(rootDirectory, jsConfigFileContent),
  //   firstElemImportDefinitionPath(importDefinitionPath)
  // );

  let errorMessage = undefined;
  

//console.log(aasd);
//console.log(searchCurrentModuleLevelInConfigTree(pathToCurrentModule));
  if (currentModuleLevel) {
    errorMessage = errorsWhenImportingLevelsSpecifiedInTheRules(
      configurationTree,
      importDefinitionPath,
      pathToCurrentModule,
      rootDirectory,
      jsConfigFileContent
    );
  }
  // } else {
  //   errorMessage = errorWhenImportingLevelsNotIncludedInRules(
  //     configurationTree,
  //     rootDirectory,
  //     pathToCurrentModule,
  //     importDefinitionPath,
  //     importLevel,
  //     currentModuleLevel,
  //     targetModuleAlias
  //   );
  return errorMessage;
  }



function firstElemImportDefinitionPath(importDefinitionPath) {
  return importDefinitionPath.split("/")[0];
}

function setLevelByKey(configurationTree, key) {
  return configurationTree.find((elem) => elem.key === key);
}
