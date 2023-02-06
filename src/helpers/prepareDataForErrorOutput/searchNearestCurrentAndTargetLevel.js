const absolutePathToFile = require("../convertPath/absolutePathToFile");
const getLevelAlias = require("../architectorTree/configurationTreeAleases");
const setNameModuleLevel = require("../serachByNameFolder/getNameFolder");
const PathToCurrentFileWithOutContent = require("../convertPath/pathToCurrentFileWithoutContent");
const setModuleByName = require("../serachByNameFolder/setModuleByName");
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
      configurationTree,
      targetModuleAlias.path
    );
  } else {
    const path = PathToCurrentFileWithOutContent(absolutePathTo(pathToCurrentModule, importDefinitionPath)) 
    return setCurrentAndTargetLevel(
      pathToCurrentModule,
      pathToCurrentModule,
      importDefinitionPath,
      configurationTree,
      path
    );
  }
}

function setCurrentAndTargetLevel(targetModule, pathToCurrentModule, importDefinitionPath, configurationTree, path) {
  const generalLevels = serachGeneralLevels(targetModule, pathToCurrentModule, importDefinitionPath);
  const moduleLevelName = currentAndTargetNameFolder(
    generalLevels,
    pathToCurrentModule,
    targetModule,
    importDefinitionPath
  );

  const targetModuleLevel = setModuleByName(configurationTree, moduleLevelName.targetName);
  const currentModuleLevel = setModuleByName(configurationTree, moduleLevelName.currentName);
  const nearestGeneralLevel = setModuleByName(configurationTree, currentModuleLevel?.parent);
  const generalPath = generalLevels.join("/");
  currentModuleLevel ? (currentModuleLevel.path = PathToCurrentFileWithOutContent(pathToCurrentModule)) : "";
  targetModuleLevel ? (targetModuleLevel.path = path) : "";
  nearestGeneralLevel ? (nearestGeneralLevel.path = currentModuleLevel.path) : "";

  if (currentModuleLevel === undefined && targetModuleLevel === undefined) {
    const currentModuleLevel = Object.assign(
      {},
      setLevelsModule(
        generalLevels,
        PathToCurrentFileWithOutContent(pathToCurrentModule),
        configurationTree,
        generalPath
      )
    );
    const targetModuleLevel = Object.assign(
      {},
      setLevelsModule(generalLevels, absolutePathTo(targetModule, importDefinitionPath), configurationTree, generalPath)
    );

    const nearestGeneralLevel = setModuleByName(configurationTree, currentModuleLevel?.parent);
    targetModuleLevel.path = PathToCurrentFileWithOutContent(pathToCurrentModule);
    currentModuleLevel.path = path;
    nearestGeneralLevel.path = targetModuleLevel.path;

    return {
      currentModuleLevel: currentModuleLevel,
      targetModuleLevel: targetModuleLevel,
      nearestGeneralLevel: nearestGeneralLevel,
    };
  }

  if (currentModuleLevel === undefined) {
    const levelsModule = setLevelsModule(
      generalLevels,
      PathToCurrentFileWithOutContent(pathToCurrentModule),
      configurationTree,
      generalPath
    );
    const nearestGeneralLevel = setModuleByName(configurationTree, levelsModule?.parent);
    targetModuleLevel.name = levelsModule.name;
    return {
      currentModuleLevel: levelsModule,
      targetModuleLevel: targetModuleLevel,
      nearestGeneralLevel: nearestGeneralLevel,
    };
  }

  if (targetModuleLevel === undefined) {
    const levelsModule = setLevelsModule(
      generalLevels,
      absolutePathTo(targetModule, importDefinitionPath),
      configurationTree,
      generalPath
    );
    levelsModule ? (levelsModule.path = path) : undefined;
    const nearestGeneralLevel = setModuleByName(configurationTree, currentModuleLevel?.parent);
    currentModuleLevel.name = levelsModule.name;
    return {
      currentModuleLevel: currentModuleLevel,
      targetModuleLevel: levelsModule,
      nearestGeneralLevel: nearestGeneralLevel,
    };
  }

  return {
    currentModuleLevel: currentModuleLevel,
    targetModuleLevel: targetModuleLevel,
    nearestGeneralLevel: nearestGeneralLevel,
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
  if (currentModuleLevel === undefined && arr.length !== 0) {
    const result = arr.slice(0, arr.length - 1);
    return setLevelsModule(result, path, configurationTree, generalPath);
  } else {
    return currentModuleLevel;
  }
}
