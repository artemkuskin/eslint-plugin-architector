const absolutePathToFile = require("./helpers/absolutePathToFile");
const getLevelAlias = require("./helpers/getLevelAlias");
const setNameModuleLevel = require("./helpers/getNameFolder");
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
    const lengthCurrentPath = lengthPathToFile(pathToCurrentModule);
    const lengthTargetPath = lengthPathToFile(targetModuleAlias.path);
    return setCurrentAndTargetLevel(
      targetModuleAlias.path,
      pathToCurrentModule,
      importDefinitionPath,
      configurationTree,
      lengthCurrentPath,
      lengthTargetPath,
      targetModuleAlias.path
    );
  } else {
    // const path = absolutePathTo(pathToCurrentModule, importDefinitionPath)
    //   .split("/")
    //   .splice(0, absolutePathTo(pathToCurrentModule, importDefinitionPath).split("/").length - 1)
    //   .join("/");
    const lengthCurrentPath = lengthPathToFile(pathToCurrentModule);
    const lengthTargetPath = lengthPathToFile(absolutePathTo(pathToCurrentModule, importDefinitionPath));
    return setCurrentAndTargetLevel(
      pathToCurrentModule,
      pathToCurrentModule,
      importDefinitionPath,
      configurationTree,
      lengthCurrentPath,
      lengthTargetPath
    );
  }
}

function setCurrentAndTargetLevel(
  targetModule,
  pathToCurrentModule,
  importDefinitionPath,
  configurationTree,
  lengthCurrentPath,
  lengthTargetPath
) {
  const generalLevels = serachGeneralLevels(targetModule, pathToCurrentModule, importDefinitionPath);
  console.log(generalLevels);
  const moduleLevelName = currentAndTargetNameFolder(
    generalLevels,
    pathToCurrentModule,
    targetModule,
    importDefinitionPath
  );
  //console.log(moduleLevelName);
  const targetModuleLevel = setModuleByName(configurationTree, moduleLevelName.targetName);
  const currentModuleLevel = setModuleByName(configurationTree, moduleLevelName.currentName);
  const generalPath = generalLevels.join("/");

  if (currentModuleLevel === undefined && targetModuleLevel === undefined) {
    const currentModuleLevel = setLevelsModule(
      generalLevels,
      PathToCurrentFileWithOutContent(pathToCurrentModule),
      configurationTree,
      generalPath
    );
    const targetModuleLevel = setLevelsModule(
      generalLevels,
      absolutePathTo(targetModule, importDefinitionPath),
      configurationTree,
      generalPath
    );
    return {
      currentModuleLevel: currentModuleLevel,
      targetModuleLevel: targetModuleLevel,
      lengthCurrentPath: lengthCurrentPath,
      lengthTargetPath: lengthTargetPath,
    };
  }

  if (currentModuleLevel === undefined) {
    const levelsModule = setLevelsModule(
      generalLevels,
      PathToCurrentFileWithOutContent(pathToCurrentModule),
      configurationTree,
      generalPath
    );
    return {
      currentModuleLevel: levelsModule,
      targetModuleLevel: levelsModule,
      lengthCurrentPath: lengthCurrentPath,
      lengthTargetPath: lengthTargetPath,
    };
  }

  if (targetModuleLevel === undefined) {
    const levelsModule = setLevelsModule(
      generalLevels,
      absolutePathTo(targetModule, importDefinitionPath),
      configurationTree,
      generalPath
    );
    return {
      currentModuleLevel: levelsModule,
      targetModuleLevel: levelsModule,
      lengthCurrentPath: lengthCurrentPath,
      lengthTargetPath: lengthTargetPath,
    }; //ПЕРЕРАБОТАТЬ
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
  const targetModulPathArr = PathToCurrentFileWithOutContent(
    absolutePathTo(targetModulePath, importDefinitionPath)
  ).split("/");
  const currentModulePatharr = PathToCurrentFileWithOutContent(currentModulePath).split("/");
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

function setLevelsModule(arr, path, configurationTree, generalPath) {
  const currentLevel = setNameModuleLevel(generalLevel(arr), path);
  const currentModuleLevel = setModuleByName(configurationTree, currentLevel);
  // const lengthArr = arr.length
  // const target = .split("/").splice(0, lengthArr).join("/")
  // const current = path.split("/").splice(0, lengthArr).join("/")
  // console.log(path, );
  if (currentModuleLevel === undefined) {
    const result = arr.slice(0, arr.length - 1);
    return setLevelsModule(result, path, configurationTree, generalPath);
  } else {
    return currentModuleLevel;
  }
}
