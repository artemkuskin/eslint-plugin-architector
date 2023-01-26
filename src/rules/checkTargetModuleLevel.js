function checkTargetModuleLevel(configurationTree, importDefinitionPath) {
    const levelsNames = configurationTree.map((levelConfiguration) => levelConfiguration.name);
  
    const levelsNamesString = levelsNames.reduce((acc, cur) => {
      return `${acc}|${cur}`;
    });
  
    const targetModuleLevel = new RegExp(`(${levelsNamesString})`, "g").exec(importDefinitionPath);
    
    return targetModuleLevel;
  }

  module.exports = checkTargetModuleLevel