const resultErrorMessage = require("../errors/resultErrorMessage");
const setCurrentLevel = require("../helpers/convertPath/setCurrentLevel");
const getArchitectureConfigurationTree = require("../helpers/architectorTree/getArchitectureConfigurationTree");
module.exports = returnAnErrorForThisImport;

function returnAnErrorForThisImport(
  rootDirectory,
  importDefinitionPath,
  pathToCurrentModule,
  levelsConfiguration,
) {
  const configurationTree = getArchitectureConfigurationTree(
    levelsConfiguration,
    levelsConfiguration,
    rootDirectory
  );
  let errorMessage = undefined;

  
    errorMessage = resultErrorMessage(
      configurationTree,
      importDefinitionPath,
      pathToCurrentModule,
      rootDirectory
    );
  
  return errorMessage;
}
