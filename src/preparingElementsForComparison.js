const absolutePathToFile = require("./helpers/absolutePathToFile");
const getLevelAlias = require("./helpers/getLevelAlias");
const getParentFolder = require("./helpers/getParentFolder");
const PathToCurrentFileWithOutContent = require("./helpers/pathToCurrentFileWithoutContent");
const setCurrentLevel = require("./helpers/setCurrentLevel");
const setModuleByName = require("./helpers/setModuleByName");

module.exports = getTargetAndPath;
function getTargetAndPath(
  pathToCurrentModule,
  importDefinitionPath,
  configurationTree,
  rootDirectory,
  jsConfigFileContent
) {
  const currentModuleLevel = setCurrentLevel(pathToCurrentModule);
  const importLevel = setCurrentLevel(importDefinitionPath);
  const currentLevelConfiguration = setModuleByName(configurationTree, currentModuleLevel);
  const configurationOfTargetModule = setModuleByName(configurationTree, importLevel);
  const firstParentCurrentModuleLevelConfiguration = setModuleByName(
    configurationTree,
    currentLevelConfiguration.firstParent
  );

  const targetModuleAlias = setLevelByKey(
    getLevelAlias(rootDirectory, jsConfigFileContent),
    firstElemImportDefinitionPath(importDefinitionPath)
  );

  if (targetModuleAlias) {
    return {
      absolutePath: absolutePathTo(targetModuleAlias.path, importDefinitionPath),
      moduleTargetLevel: setLevelsTarget(configurationTree,absolutePathTo(targetModuleAlias.path, importDefinitionPath), rootDirectory),
      currentLevel: firstParentCurrentModuleLevelConfiguration,
    };
  } else if (currentLevelConfiguration && configurationOfTargetModule) {
    return {
      moduleTargetLevel: setModuleByName(configurationTree, configurationOfTargetModule.firstParent),
      absolutePath: absolutePathTo(pathToCurrentModule, importDefinitionPath),
      currentLevel: firstParentCurrentModuleLevelConfiguration,
    };
  } else {
    return {
      moduleTargetLevel: setLevelsTarget(configurationTree, absolutePathToTargetModule, rootDirectory),
      absolutePath: absolutePathTo(pathToCurrentModule, importDefinitionPath),
      currentLevel: firstParentCurrentModuleLevelConfiguration,
    };
  }
}

function firstElemImportDefinitionPath(importDefinitionPath) {
  return importDefinitionPath.split("/")[0];
}

function setLevelByKey(configurationTree, key) {
  return configurationTree.find((elem) => elem.key === key);
}

function absolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(PathToCurrentFileWithOutContent(pathToModule), importDefinitionPath);
}
function setLevelsTarget(configurationTree, absolutePathToTargetLevel, rootDirectory) {
  return setModuleByName(configurationTree, getParentFolder(rootDirectory, absolutePathToTargetLevel));
}

function setLevelsCurent(configurationTree, rootDirectory, pathToCurrentModule) {
  return setModuleByName(
    configurationTree,
    getParentFolder(rootDirectory, PathToCurrentFileWithOutContent(pathToCurrentModule))
  );
}
