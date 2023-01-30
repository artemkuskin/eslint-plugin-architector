const returnOfAllPossibleErrors = require("./returnOfAllPossibleErrors");
const getArchitectureConfigurationTree = require("./getArchitectureConfigurationTree");
module.exports = getImportError;

function getImportError(
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
  return returnOfAllPossibleErrors(configurationTree, pathToCurrentModule, importDefinitionPath, rootDirectory, jsConfigFileContent);
}

