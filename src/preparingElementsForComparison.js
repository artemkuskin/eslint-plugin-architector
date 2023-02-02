const absolutePathToFile = require("./helpers/absolutePathToFile");
const getLevelAlias = require("./helpers/getLevelAlias");
const setNameModuleLevel = require("./helpers/getParentFolder");
const PathToCurrentFileWithOutContent = require("./helpers/pathToCurrentFileWithoutContent");
const setModuleByName = require("./helpers/setModuleByName");
module.exports = test;
function test(importDefinitionPath, configurationTree, pathToCurrentModule, rootDirectory, jsConfigFileContent) {
  const targetModuleAlias = setLevelByKey(
    getLevelAlias(rootDirectory, jsConfigFileContent),
    firstElemImportDefinitionPath(importDefinitionPath)
  );

  if (targetModuleAlias) {
    let generalLevels = serachGeneralLevels(targetModuleAlias.path, pathToCurrentModule, importDefinitionPath);

    const moduleLevelName = currentAndTargetNameFolder (generalLevels, pathToCurrentModule, targetModuleAlias.path, importDefinitionPath)

    // const current = setNameModuleLevel(generalLevel(generalLevels), PathToCurrentFileWithOutContent(pathToCurrentModule));
    // const target = setNameModuleLevel(
    //   generalLevel(generalLevels),
    //   PathToCurrentFileWithOutContent(
    //   absolutePathTo(PathToCurrentFileWithOutContent(targetModuleAlias.path), importDefinitionPath))
    // );
    const targetModuleLevel = setModuleByName(configurationTree, moduleLevelName.targetName);
    const currentModuleLevel = setModuleByName(configurationTree, moduleLevelName.currentName);

    if (targetModuleLevel === undefined || targetModuleLevel == undefined) {
      const currentLevel = setModuleByName(configurationTree, generalLevel(generalLevels));
      const targetModuleLevel = setModuleByName(configurationTree, generalLevel(generalLevels));
      return { currentModuleLevel: currentLevel, targetModuleLevel: targetModuleLevel };
    }

    return { currentModuleLevel: currentModuleLevel, targetModuleLevel: targetModuleLevel };
  } else {
    const generalLevels = serachGeneralLevels(pathToCurrentModule ,pathToCurrentModule, importDefinitionPath);
    const moduleLevelName = currentAndTargetNameFolder (generalLevels, pathToCurrentModule, pathToCurrentModule, importDefinitionPath)
    // let current = setNameModuleLevel(generalLevel(generalLevels), PathToCurrentFileWithOutContent(pathToCurrentModule));
    // let target = setNameModuleLevel(
    //   generalLevel(generalLevels),
    //   PathToCurrentFileWithOutContent(
    //     absolutePathTo(pathToCurrentModule, importDefinitionPath)
    //   )
    // );

    const targetModuleLevel = setModuleByName(configurationTree, moduleLevelName.targetName);
    const currentModuleLevel = setModuleByName(configurationTree, moduleLevelName.currentName);

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

function currentAndTargetNameFolder (generalLevels, pathToCurrentModule, targetModule, importDefinitionPath) {
  const current = setNameModuleLevel(generalLevel(generalLevels), PathToCurrentFileWithOutContent(pathToCurrentModule));
    const target = setNameModuleLevel(
      generalLevel(generalLevels),
      PathToCurrentFileWithOutContent(
      absolutePathTo(targetModule, importDefinitionPath))
    );
    return {currentName: current, targetName: target}
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

// function serachGeneralLevels(targetModulePath ,currentModulePath, importDefinitionPath) {
//   const targetModulPathArr = absolutePathTo(targetModulePath, importDefinitionPath).split("/");
//   const currentModulePatharr = currentModulePath.split("/");
//   const generalLevels = targetModulPathArr.filter((x) => currentModulePatharr.indexOf(x) !== -1);
//   return generalLevels;
// }

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
