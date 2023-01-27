const absolutePathToFile = require("./absolutePathToFile");
const PathToCurrentFileWithOutContent = require("./pathToCurrentFileWithoutContent");
const setModuleByName = require("./setModuleByName");
module.exports = outputOfErrorsWhenImportingLevelsSpecifiedInTheRules;

function outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
  currentModuleLevelConfiguration,
  configurationOfTargetModule,
  importLevel,
  currentModuleLevel,
  configurationTree,
  importDefinitionPath,
  pathToCurrentModule
) {
  let errorMessage = undefined;
  const firstParentCurrentModuleLevelConfiguration = setModuleByName(
    configurationTree,
    currentModuleLevelConfiguration.firstParent
  );
  const firstParentConfigurationOfTargetModule = setModuleByName(
    configurationTree,
    configurationOfTargetModule.firstParent
  );
  // const LevelAliasInRules = configurationTree.find((elem) => elem.name === targetLevelAlias.key);
  // const firstParentConfigurationOfTargetAliases = setModuleByName(configurationTree, LevelAliasInRules.firstParent);
  // if (targetLevelAlias) {
  //   if (
  //     currentModuleLevelConfiguration.parents === LevelAliasInRules.parents &&
  //     LevelAliasInRules.index >= currentModuleLevelConfiguration.index
  //     ) {
  //     return `Cannot import ${importLevel} from ${currentModuleLevel}`;
  //   }
  //   if (
  //     currentModuleLevelConfiguration.firstParent !== LevelAliasInRules.firstParent &&
  //     firstParentConfigurationOfTargetAliases.index >= firstParentCurrentModuleLevelConfiguration.index
  //   ) {
  //     return `aaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
  //   }
  // }
  const absolutePathToTargetModule = absolutePathTo(pathToCurrentModule, importDefinitionPath);
  console.log(absolutePathToTargetModule);
  if (
    currentModuleLevelConfiguration.parents === configurationOfTargetModule.parents &&
    configurationOfTargetModule.index >= currentModuleLevelConfiguration.index
  ) {
    return `Cannot import ${importLevel} from ${currentModuleLevel}`;
  }
  if (
    currentModuleLevelConfiguration.firstParent !== configurationOfTargetModule.firstParent &&
    firstParentConfigurationOfTargetModule.index >= firstParentCurrentModuleLevelConfiguration.index
  ) {
    return `aaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
  }
  if (
    currentModuleLevelConfiguration.firstParent === configurationOfTargetModule.firstParent &&
    lengthPathToFile(absolutePathToTargetModule) < lengthPathToFile(pathToCurrentModule)
  ) {
    return `[[[[[[[[[[aaaaaaaaaaaaaaaaaaaaaaaaaaaa]]]]]]]]]]`;
  }
  
  //return errorMessage;
}

function absolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(PathToCurrentFileWithOutContent(pathToModule), importDefinitionPath);
}

function lengthPathToFile(path) {
  return path.split("/").length;
}
// function setErrorsWithEqualParents(
//   currentModuleLevelConfiguration,
//   configurationOfTargetModule,
//   importLevel,
//   currentModuleLevel
// ) {
//   if (
//     currentModuleLevelConfiguration.parents === configurationOfTargetModule.parents &&
//     configurationOfTargetModule.index >= currentModuleLevelConfiguration.index
//   ) {
//     return `Cannot import ${importLevel} from ${currentModuleLevel}`;
//   }
// }

// function setErrorsWithNotEquilFirstParetnt(
//   currentModuleLevelConfiguration,
//   configurationOfTargetModule,
//   firstParentConfigurationOfTargetModule,
//   firstParentCurrentModuleLevelConfiguration
// ) {
//   if (
//     currentModuleLevelConfiguration.firstParent !== configurationOfTargetModule.firstParent &&
//     firstParentConfigurationOfTargetModule.index >= firstParentCurrentModuleLevelConfiguration.index
//   ) {
//     return `aaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
//   }
// }
