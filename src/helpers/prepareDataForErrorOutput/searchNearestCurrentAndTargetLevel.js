const absolutePathToFile = require("../convertPath/absolutePathToFile");
const getLevelAlias = require("../architectorTree/configurationTreeAleases");
const setNameModuleLevel = require("../serachByNameFolder/getNameFolder");
const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");
const setModuleByName = require("../serachByNameFolder/setModuleByName");
module.exports = searchNearestCurrentAndTargetLevel;

// let jsConfigFileContent = undefined;  

function searchNearestCurrentAndTargetLevel(
  importDefinitionPath,
  configurationTree,
  pathToCurrentModule,
  rootDirectory,
  jsConfigFileContent
) {

  // if (jsConfigFileContent === undefined) {
  //   setJsConfigFile();
  // }

  const targetModuleAlias = setLevelByKey(
    getLevelAlias(rootDirectory, jsConfigFileContent),
    firstElemImportDefinitionPath(importDefinitionPath)
  );

  const absolutePathToTargetModule = getAbsolutePathToTargetModule({
    pathToCurrentModule,
    importDefinitionPath,
    targetModuleAlias,
  })
 
 
    return setCurrentAndTargetLevel(
      pathToCurrentModule,
      importDefinitionPath,
      configurationTree,
      absolutePathToTargetModule
    );
  
}

function setJsConfigFile() {
  try {
    jsConfigFileContent = require(path.resolve("jsconfig.json"));
  } catch {
    jsConfigFileContent = null;
  }
}


function getAbsolutePathToTargetModule({
  pathToCurrentModule,
  importDefinitionPath,
  targetModuleAlias,
}) {
  let absolutePathToTargetModule;
  
  if(Boolean(targetModuleAlias)) {
    absolutePathToTargetModule = targetModuleAlias.path;
  } 
  else {
    absolutePathToTargetModule = getPathToCurrentFileWithoutExtension(absolutePathTo(pathToCurrentModule, importDefinitionPath))
  } 

  return absolutePathToTargetModule;
}

function setCurrentAndTargetLevel(pathToCurrentModule, importDefinitionPath, configurationTree, path) {
  const generalLevels = serachGeneralLevels(path, pathToCurrentModule, importDefinitionPath);
  const moduleLevelName = currentAndTargetNameFolder(
    generalLevels,
    pathToCurrentModule,
    path,
    importDefinitionPath
  );

  const targetModuleLevel = setModuleByName(configurationTree, moduleLevelName.targetName);
  const currentModuleLevel = setModuleByName(configurationTree, moduleLevelName.currentName);
  const nearestGeneralLevel = setModuleByName(configurationTree, currentModuleLevel?.parent);
  const generalPath = generalLevels.join("/");
  currentModuleLevel ? (currentModuleLevel.path = getPathToCurrentFileWithoutExtension(pathToCurrentModule)) : "";
  targetModuleLevel ? (targetModuleLevel.path = path) : "";
  nearestGeneralLevel ? (nearestGeneralLevel.path = currentModuleLevel.path) : "";

  if (currentModuleLevel === undefined && targetModuleLevel === undefined) {
    const currentModuleLevel = Object.assign(
      {},
      setLevelsModule(
        generalLevels,
        getPathToCurrentFileWithoutExtension(pathToCurrentModule),
        configurationTree,
        generalPath
      )
    );
    const targetModuleLevel = Object.assign(
      {},
      setLevelsModule(generalLevels, absolutePathTo(pathToCurrentModule, importDefinitionPath), configurationTree, generalPath)
    );

    const nearestGeneralLevel = setModuleByName(configurationTree, currentModuleLevel?.parent);

    targetModuleLevel.path = getPathToCurrentFileWithoutExtension(pathToCurrentModule);
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
      getPathToCurrentFileWithoutExtension(pathToCurrentModule),
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
      absolutePathTo(pathToCurrentModule, importDefinitionPath),
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
  const current = setNameModuleLevel(generalLevel(generalLevels), getPathToCurrentFileWithoutExtension(pathToCurrentModule));
  const target = setNameModuleLevel(
    generalLevel(generalLevels),
    targetModule
  );
  return { currentName: current, targetName: target };
}

function generalLevel(generalLevels) {
  return generalLevels[generalLevels.length - 1];
}

function serachGeneralLevels(targetModulePath, currentModulePath, importDefinitionPath) {
  const targetModulPathArr = targetModulePath.split("/");
  const currentModulePatharr = getPathToCurrentFileWithoutExtension(currentModulePath).split("/");
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
  return absolutePathToFile(getPathToCurrentFileWithoutExtension(pathToModule), importDefinitionPath);
}

function setLevelsModule(arr, path, configurationTree, generalPath) {
  const currentLevel = setNameModuleLevel(generalLevel(arr), path);
  const currentModuleLevel = setModuleByName(configurationTree, currentLevel);
  if (currentModuleLevel === undefined && arr.length !== 0) {
    const result = arr.slice(0, arr.length - 1);
    return setLevelsModule(result, path, configurationTree, generalPath);
  } else {
    return currentModuleLevel;
  }
}
