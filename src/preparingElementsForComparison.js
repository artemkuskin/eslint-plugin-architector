const absolutePathToFile = require("./helpers/absolutePathToFile");
const getLevelAlias = require("./helpers/getLevelAlias");
const getParentFolder = require("./helpers/getParentFolder");
const PathToCurrentFileWithOutContent = require("./helpers/pathToCurrentFileWithoutContent");
const setCurrentLevel = require("./helpers/setCurrentLevel");
const setModuleByName = require("./helpers/setModuleByName");
module.exports = test;
function test(importDefinitionPath, configurationTree, pathToCurrentModule, rootDirectory, jsConfigFileContent) {

  const targetModuleAlias = setLevelByKey(
    getLevelAlias(rootDirectory, jsConfigFileContent),
    firstElemImportDefinitionPath(importDefinitionPath)
  );

  if (targetModuleAlias) {
    let generalLevels = serachGeneralLevelsAlias(targetModuleAlias.path, pathToCurrentModule, importDefinitionPath)
    const current = getParentFolder(generlLevel(generalLevels), pathToCurrentModule);
    const target = getParentFolder(
      generlLevel(generalLevels),
      absolutePathTo(targetModuleAlias.path, importDefinitionPath)
    );
    const targetModuleLevel = setModuleByName(configurationTree, target)
    const currentModuleLevel = setModuleByName(configurationTree, current) 

    if (targetModuleLevel === undefined || targetModuleLevel == undefined) {
      const currentLevel = setModuleByName(configurationTree, generlLevel(generalLevels))
      const targetModuleLevel = setModuleByName(configurationTree, generlLevel(generalLevels))
      return { currentModuleLevel: currentLevel, targetModuleLevel: targetModuleLevel };
    }

    return { currentModuleLevel: currentModuleLevel, targetModuleLevel: targetModuleLevel };

  } else {

    const generalLevels = serachGeneralLevels (pathToCurrentModule,  importDefinitionPath)

    let current = getParentFolder(
      generlLevel(generalLevels),
      PathToCurrentFileWithOutContent(pathToCurrentModule)
    );
    let target = getParentFolder(
      generlLevel(generalLevels),
      PathToCurrentFileWithOutContent(
        absolutePathToFile(PathToCurrentFileWithOutContent(pathToCurrentModule), importDefinitionPath)
      )
    );

    const targetModuleLevel = setModuleByName(configurationTree, target)
    const currentModuleLevel = setModuleByName(configurationTree, current)

    if (currentModuleLevel === undefined) {
      const levelsModule = setLevelsModule(generalLevels, pathToCurrentModule, configurationTree);

      return { currentModuleLevel: levelsModule, targetModuleLevel: levelsModule }; //ПЕРЕРАБОТАТЬ
    }

    if (targetModuleLevel === undefined) {
      const levelsModule = setLevelsModule(
        generalLevels,
        absolutePathToFile(PathToCurrentFileWithOutContent(pathToCurrentModule), importDefinitionPath),
        configurationTree
      );
      return { currentModuleLevel: levelsModule, targetModuleLevel: levelsModule }; //ПЕРЕРАБОТАТЬ
    }
    return { currentModuleLevel: currentModuleLevel, targetModuleLevel: targetModuleLevel };
  }
}

function generlLevel (generalLevels) {
  return generalLevels[generalLevels.length - 1]
}

function serachGeneralLevelsAlias (targetModulePath,currentModulePath,  importDefinitionPath) {
  const targetModulPathArr = absolutePathTo(targetModulePath, importDefinitionPath).split("/");
  const currentModulePatharr = currentModulePath.split("/");
  const generalLevels = targetModulPathArr.filter((x) => currentModulePatharr.indexOf(x) !== -1);
  return generalLevels
}

function serachGeneralLevels (currentModulePath,  importDefinitionPath) {
  const targetModulPathArr = absolutePathToFile(
    PathToCurrentFileWithOutContent(currentModulePath),
    importDefinitionPath
  ).split("/")
  const currentModulePatharr = currentModulePath.split("/");
  const generalLevels = targetModulPathArr.filter((x) => currentModulePatharr.indexOf(x) !== -1);
  return generalLevels
}

function setLevelByKey(configurationTree, key) {
  return configurationTree.find((elem) => elem.key === key);
}

function firstElemImportDefinitionPath(importDefinitionPath) {
  return importDefinitionPath.split("/")[0];
}

function absolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(PathToCurrentFileWithOutContent(pathToModule), importDefinitionPath);
}

function setLevelsTarget(configurationTree, absolutePathToTargetLevel, rootDirectory) {
  return setModuleByName(configurationTree, getParentFolder(rootDirectory, absolutePathToTargetLevel));
}

function setLevelsModule(arr, path, configurationTree) {
  const currentLevel = getParentFolder(generlLevel(arr), PathToCurrentFileWithOutContent(path));
  const currentModuleLevel =setModuleByName(configurationTree, currentLevel);
  if (currentModuleLevel === undefined) {
    const a = arr.slice(0, arr.length - 1);
    return setLevelsModule(a, path, configurationTree);
  } else {
    return currentModuleLevel;
  }
}
