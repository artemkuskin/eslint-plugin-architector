const returnOfAllPossibleErrors = require("./rules/returnOfAllPossibleErrors");
const getArchitectureConfigurationTree = require("./helpers/getArchitectureConfigurationTree");
const absolutePathToFile = require("./helpers/absolutePathToFile");
const setModuleByName = require("./helpers/setModuleByName");
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
  // const currentModuleLevel = setCurrentLevel(pathToCurrentModule);
  // const importLevel = setCurrentLevel(importDefinitionPath);
  // const currentLevelConfiguration = setModuleByName(configurationTree, currentModuleLevel);
  // const configurationOfTargetModule = setModuleByName(configurationTree, importLevel);
  // const firstParentCurrentModuleLevelConfiguration = setModuleByName(
  //   configurationTree,
  //   currentLevelConfiguration.firstParent
  // );

  // let moduleTargetLevel;
  // let absolutePath;
  // const targetModuleAlias = setLevelByKey(
  //   getLevelAlias(rootDirectory, jsConfigFileContent),
  //   firstElemImportDefinitionPath(importDefinitionPath)
  // );

  // if (targetModuleAlias) {
  //    absolutePath = absolutePathTo(targetAliasModule.path, importDefinitionPath);
  //    moduleTargetLevel = setLevelsTarget(
  //     configurationTree,
  //     absolutePath,
  //     rootDirectory
  //   );
  // } else if (currentLevelConfiguration && configurationOfTargetModule) {
  //    moduleTargetLevel = setModuleByName(
  //     configurationTree,
  //     configurationOfTargetModule.firstParent
  //   );
  //   absolutePath = absolutePathTo(pathToCurrentModule, importDefinitionPath)
  // } else {
  //   moduleTargetLevel = setLevelsTarget(configurationTree, absolutePathToTargetModule, rootDirectory)
  //   absolutePath = absolutePathTo(pathToCurrentModule, importDefinitionPath)
  // }

  return returnOfAllPossibleErrors(
    configurationTree,
    pathToCurrentModule,
    importDefinitionPath,
    rootDirectory,
    jsConfigFileContent
  );
}


function firstElemImportDefinitionPath(importDefinitionPath) {
  return importDefinitionPath.split("/")[0];
}

function setLevelByKey(configurationTree, key) {
  return configurationTree.find((elem) => elem.key === key);
}

function absolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(PathToCurrentFileWithoutContent(pathToModule), importDefinitionPath);
}
function setLevelsTarget(configurationTree, absolutePathToTargetLevel, rootDirectory) {
  return setModuleByName(configurationTree, getParentFolder(rootDirectory, absolutePathToTargetLevel));
}

function setLevelsCurent(configurationTree, rootDirectory, pathToCurrentModule) {
  return setModuleByName(
    configurationTree,
    getParentFolder(rootDirectory, PathToCurrentFileWithoutContent(pathToCurrentModule))
  );
}