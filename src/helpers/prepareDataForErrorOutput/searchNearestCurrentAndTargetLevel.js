const absolutePathToFile = require("../convertPath/absolutePathToFile");
const getLevelAlias = require("../architectorTree/configurationTreeAleases");
const setNameModuleLevel = require("../serachByNameFolder/getNameFolder");
const lengthPathToFile = require("../lengthPathToFile");
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
    const path = absolutePathTo(pathToCurrentModule, importDefinitionPath).split("/").splice(0, absolutePathTo(pathToCurrentModule, importDefinitionPath).split("/").length - 1).join("/")
    return setCurrentAndTargetLevel(
      pathToCurrentModule,
      pathToCurrentModule,
      importDefinitionPath,
      configurationTree,
      path
    );
  }
}

function setCurrentAndTargetLevel(
  targetModule,
  pathToCurrentModule,
  importDefinitionPath,
  configurationTree,
  path

) {
  console.log(pathToCurrentModule);
  const generalLevels = serachGeneralLevels(targetModule, pathToCurrentModule, importDefinitionPath);
  //console.log(generalLevels);
  const moduleLevelName = currentAndTargetNameFolder(
    generalLevels,
    pathToCurrentModule,
    targetModule,
    importDefinitionPath
  );
  //console.log(moduleLevelName);

  const targetModuleLevel = setModuleByName(configurationTree, moduleLevelName.targetName);
  const currentModuleLevel = setModuleByName(configurationTree, moduleLevelName.currentName);
  const nearestGeneralLevel = setModuleByName(configurationTree, currentModuleLevel?.parent)
  const generalPath = generalLevels.join("/");
  currentModuleLevel ? currentModuleLevel.path = PathToCurrentFileWithOutContent(pathToCurrentModule) : ''
  targetModuleLevel? targetModuleLevel.path = path : ''
  nearestGeneralLevel? nearestGeneralLevel.path = currentModuleLevel.path : ''
  
  if (currentModuleLevel === undefined && targetModuleLevel === undefined) {
    console.log(1);
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
    const clone = Object.assign({}, targetModuleLevel)
    const clone2 = Object.assign({}, currentModuleLevel)
    clone.path = PathToCurrentFileWithOutContent(pathToCurrentModule)
    clone2.path = path
   
    //currentModuleLevel.path =  pathToCurrentModule
    //targetModuleLevel.path = path  //ПРОБЛЕМА ТУТ
    const nearestGeneralLevel = setModuleByName(configurationTree, currentModuleLevel?.parent)
     nearestGeneralLevel.path = clone.path 
    
    return {
      currentModuleLevel: clone2,
      targetModuleLevel: clone,
      nearestGeneralLevel: nearestGeneralLevel
    };
  }

  if (currentModuleLevel === undefined) {
    console.log(2);
    const levelsModule = setLevelsModule(
      generalLevels,
      PathToCurrentFileWithOutContent(pathToCurrentModule),
      configurationTree,
      generalPath
    );
    const nearestGeneralLevel = setModuleByName(configurationTree, levelsModule?.parent)
    targetModuleLevel.name = levelsModule.name
    return {
      currentModuleLevel: levelsModule,
      targetModuleLevel: targetModuleLevel,
      nearestGeneralLevel: nearestGeneralLevel
    };
  }

  if (targetModuleLevel === undefined) {
    console.log(3);
    const levelsModule = setLevelsModule(
      generalLevels,
      absolutePathTo(targetModule, importDefinitionPath),
      configurationTree,
      generalPath
    );
    levelsModule? levelsModule.path = path : undefined
    const nearestGeneralLevel = setModuleByName(configurationTree, currentModuleLevel?.parent)
    currentModuleLevel.name = levelsModule.name
    return {
      currentModuleLevel: currentModuleLevel,
      targetModuleLevel: levelsModule,
      nearestGeneralLevel: nearestGeneralLevel
    }; //ПЕРЕРАБОТАТЬ
  }

  return {
    currentModuleLevel: currentModuleLevel,
    targetModuleLevel: targetModuleLevel,
    nearestGeneralLevel:nearestGeneralLevel
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
