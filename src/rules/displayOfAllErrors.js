//const getTargetModuleLevel = require("./checkTargetModuleLevel");
const errors = require("./errors");
//const errorOutputWhenUsingAliases = require("./errorOutputWhenUsingAliases");
const getArchitectureConfigurationTree = require("./getArchitectureConfigurationTree");
const getLevelAlias = require("./getLevelAlias");

 function displayOfAllErrors (rootDirectory, importDefinitionPath, pathToCurrentModule, levelsConfiguration, jsConfigFileContent) {
    const configurationTree = getArchitectureConfigurationTree(
      levelsConfiguration.file,
      levelsConfiguration,
      rootDirectory
    );
    const targetModuleAlias = getLevelAlias(rootDirectory, jsConfigFileContent).find(
      (elem) => elem.key === importDefinitionPath.split("/")[0]
      );   
    //const targetModuleLevel = getTargetModuleLevel(configurationTree, importDefinitionPath);
        return errors(configurationTree, pathToCurrentModule, importDefinitionPath, rootDirectory, targetModuleAlias);
      
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
  
  }

  module.exports = displayOfAllErrors