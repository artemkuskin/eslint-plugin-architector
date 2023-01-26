const checkTargetModuleLevel = require("./checkTargetModuleLevel");
const errorIfNotAlias = require("./errorIfNotAlias");
const errorOutputWhenUsingAliases = require("./errorOutputWhenUsingAliases");
const getArchitectureConfigurationTree = require("./getArchitectureConfigurationTree");
const getLevelAlias = require("./getLevelAlias");

 function displayOfAllErrors (rootDirectory, importDefinitionPath, pathToCurrentModule, levelsConfiguration, jsConfigFileContent) {
    const configurationTree = getArchitectureConfigurationTree(
      levelsConfiguration.file,
      levelsConfiguration,
      rootDirectory
    );
    const targetModuleLevel = checkTargetModuleLevel(configurationTree, importDefinitionPath);
    const targetAliasModule = getLevelAlias(rootDirectory, jsConfigFileContent).find(
      (elem) => elem.key === importDefinitionPath.split("/")[0]
      );
    if (jsConfigFileContent) {
      if (targetAliasModule) {
        return errorOutputWhenUsingAliases(
          targetAliasModule,
          importDefinitionPath,
          pathToCurrentModule,
          rootDirectory,
          configurationTree
        );
      }
    }
  
    if (targetModuleLevel) {
      return errorIfNotAlias(configurationTree, pathToCurrentModule, importDefinitionPath, rootDirectory);
    }
  }

  module.exports = displayOfAllErrors