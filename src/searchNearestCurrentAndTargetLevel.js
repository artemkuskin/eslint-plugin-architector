const absolutePathToFile = require("./helpers/absolutePathToFile");
const getLevelAlias = require("./helpers/getLevelAlias");
const setNameModuleLevel = require("./helpers/getParentFolder");
const lengthPathToFile = require("./helpers/lengthPathToFile");
const PathToCurrentFileWithOutContent = require("./helpers/pathToCurrentFileWithoutContent");
const setModuleByName = require("./helpers/setModuleByName");
module.exports = searchNearestCurrentAndTargetLevel;
function searchNearestCurrentAndTargetLevel(
  importDefinitionPath,
  configurationTree,
  pathToCurrentModule,
  rootDirectory,
  jsConfigFileContent
) {
  const targetModuleAlias = setLevelByKey(
    getLevelAlias(rootDirectory, jsConfigFileContent),
    firstElemImportDefinitionPath(importDefinitionPath)
  );

  if (targetModuleAlias) {
    return setCurrentAndTargetLevel(
      targetModuleAlias.path,
      pathToCurrentModule,
      importDefinitionPath,
      configurationTree
    );
  } else {
    return setCurrentAndTargetLevel(pathToCurrentModule, pathToCurrentModule, importDefinitionPath, configurationTree);
  }
}

function setCurrentAndTargetLevel(targetModule, pathToCurrentModule, importDefinitionPath, configurationTree) {
  const generalLevels = serachGeneralLevels(targetModule, pathToCurrentModule, importDefinitionPath);

  const moduleLevelName = currentAndTargetNameFolder(
    generalLevels,
    pathToCurrentModule,
    targetModule,
    importDefinitionPath
  );
  const targetModuleLevel = setModuleByName(configurationTree, moduleLevelName.targetName);
  const currentModuleLevel = setModuleByName(configurationTree, moduleLevelName.currentName);
  const lengthCurrentPath = lengthPathToFile(pathToCurrentModule);
  const lengthTargetPath = lengthPathToFile(absolutePathTo(pathToCurrentModule, importDefinitionPath));

  if (currentModuleLevel === undefined) {
    const levelsModule = setLevelsModule(generalLevels, pathToCurrentModule, configurationTree);
    return { currentModuleLevel: levelsModule, targetModuleLevel: levelsModule }; //ПЕРЕРАБОТАТЬ
  }

  if (targetModuleLevel === undefined) {
    const levelsModule = setLevelsModule(
      generalLevels,
      absolutePathTo(pathToCurrentModule, importDefinitionPath),
      configurationTree
    );
    return { currentModuleLevel: levelsModule, targetModuleLevel: levelsModule }; //ПЕРЕРАБОТАТЬ
  }
  return {
    currentModuleLevel: currentModuleLevel,
    targetModuleLevel: targetModuleLevel,
    lengthCurrentPath: lengthCurrentPath,
    lengthTargetPath: lengthTargetPath,
  };
}

function currentAndTargetNameFolder(generalLevels, pathToCurrentModule, targetModule, importDefinitionPath) {
  const current = setNameModuleLevel(generalLevel(generalLevels), PathToCurrentFileWithOutContent(pathToCurrentModule));
  const target = setNameModuleLevel(
    generalLevel(generalLevels),
    PathToCurrentFileWithOutContent(absolutePathTo(targetModule, importDefinitionPath))
  );
  return { currentName: current, targetName: target };
}

function generalLevel(generalLevels) {
  return generalLevels[generalLevels.length - 1];
}

function serachGeneralLevels(targetModulePath, currentModulePath, importDefinitionPath) {
  const targetModulPathArr = absolutePathTo(targetModulePath, importDefinitionPath).split("/");
  const currentModulePatharr = currentModulePath.split("/");
  const generalLevels = targetModulPathArr.filter((x) => currentModulePatharr.indexOf(x) !== -1);
  return generalLevels;
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

function setLevelsModule(arr, path, configurationTree) {
  const currentLevel = setNameModuleLevel(generalLevel(arr), PathToCurrentFileWithOutContent(path));
  const currentModuleLevel = setModuleByName(configurationTree, currentLevel);
  if (currentModuleLevel === undefined) {
    const a = arr.slice(0, arr.length - 1);
    return setLevelsModule(a, path, configurationTree);
  } else {
    return currentModuleLevel;
  }
}
