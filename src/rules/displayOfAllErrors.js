const getTargetModuleLevel = require("./checkTargetModuleLevel");
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
    const targetModuleLevel = getTargetModuleLevel(configurationTree, importDefinitionPath);
    const targetModuleAlias = getLevelAlias(rootDirectory, jsConfigFileContent).find(
      (elem) => elem.key === importDefinitionPath.split("/")[0]
      );
      
    // if (jsConfigFileContent) {
      // if (targetModuleAlias) {
      //   return errorOutputWhenUsingAliases(
      //     targetModuleAlias,
      //     importDefinitionPath,
      //     pathToCurrentModule,
      //     rootDirectory,
      //     configurationTree
      //   );
      // }
    // }
  
    if (targetModuleLevel) {
      return errorIfNotAlias(configurationTree, pathToCurrentModule, importDefinitionPath, rootDirectory, targetModuleAlias);
    }
  }

  module.exports = displayOfAllErrors