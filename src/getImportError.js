const returnOfAllPossibleErrors = require("./rules/returnOfAllPossibleErrors");
const getArchitectureConfigurationTree = require("./helpers/getArchitectureConfigurationTree");
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
  return returnOfAllPossibleErrors(
    configurationTree,
    pathToCurrentModule,
    importDefinitionPath,
    rootDirectory,
    jsConfigFileContent
  );
}
