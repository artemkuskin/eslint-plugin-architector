const errors = require("./errors");
const getArchitectureConfigurationTree = require("./getArchitectureConfigurationTree");
const getLevelAlias = require("./getLevelAlias");
module.exports = displayOfAllErrors;

function displayOfAllErrors(
  rootDirectory,
  importDefinitionPath,
  pathToCurrentModule,
  levelsConfiguration,
  jsConfigFileContent
) {
  const configurationTree = getArchitectureConfigurationTree(
    levelsConfiguration.file,
    levelsConfiguration,
    rootDirectory
  );
  const targetModuleAlias = getLevelAlias(rootDirectory, jsConfigFileContent).find(
    (elem) => elem.key === importDefinitionPath.split("/")[0]
  );
  return errors(configurationTree, pathToCurrentModule, importDefinitionPath, rootDirectory, targetModuleAlias);
}
