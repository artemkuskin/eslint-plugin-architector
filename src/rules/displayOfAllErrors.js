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
  return errors(configurationTree, pathToCurrentModule, importDefinitionPath, rootDirectory, jsConfigFileContent);
}

