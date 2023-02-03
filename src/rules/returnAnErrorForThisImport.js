const resultErrorMessage = require("../errors/resultErrorMessage");
const setCurrentLevel = require("../helpers/convertPath/setCurrentLevel");
const getArchitectureConfigurationTree = require("../helpers/architectorTree/getArchitectureConfigurationTree");
module.exports = returnAnErrorForThisImport;

function returnAnErrorForThisImport(
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
    errorMessage = resultErrorMessage(
      configurationTree,
      importDefinitionPath,
      pathToCurrentModule,
      rootDirectory,
      jsConfigFileContent
    );
  }
  return errorMessage;
  }



// function firstElemImportDefinitionPath(importDefinitionPath) {
//   return importDefinitionPath.split("/")[0];
// }

// function setLevelByKey(configurationTree, key) {
//   return configurationTree.find((elem) => elem.key === key);
// }
