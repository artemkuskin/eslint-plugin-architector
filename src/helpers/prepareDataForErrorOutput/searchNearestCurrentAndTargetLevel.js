const path = require("path");
const absolutePathToFile = require("../convertPath/absolutePathToFile");
const getLevelAlias = require("../architectorTree/configurationTreeAleases");
const setNameModuleLevel = require("../serachByNameFolder/getNameFolder");
const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");
const setModuleByName = require("../serachByNameFolder/setModuleByName");
const getArchitectureConfigurationTree = require("../architectorTree/getArchitectureConfigurationTree");
module.exports = searchNearestCurrentAndTargetLevel;

let jsConfigFileContent = undefined;

function searchNearestCurrentAndTargetLevel({
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
  levelsConfigurationFile,
  levelsConfiguration,
}) {
  if (jsConfigFileContent === undefined) {
    setJsConfigFile();
  }

  const targetModuleAlias = setLevelByKey(
    getLevelAlias(rootDirectory, jsConfigFileContent),
    firstElemImportDefinitionPath(importDefinitionPath)
  );
  const configurationTree = getArchitectureConfigurationTree(
    levelsConfigurationFile,
    levelsConfiguration,
    rootDirectory
  );

  const absolutePathToTargetModule = getAbsolutePathToTargetModule({
    pathToCurrentModule,
    importDefinitionPath,
    targetModuleAlias,
  });

  return setCurrentAndTargetLevel({
    pathToCurrentModule,
    importDefinitionPath,
    configurationTree,
    absolutePathToTargetModule,
  });
}

function setJsConfigFile() {
  try {
    jsConfigFileContent = require(path.resolve("jsconfig.json"));
  } catch {
    jsConfigFileContent = null;
  }
}

function getAbsolutePathToTargetModule({ pathToCurrentModule, importDefinitionPath, targetModuleAlias }) {
  let absolutePathToTargetModule;

  if (Boolean(targetModuleAlias)) {
    absolutePathToTargetModule = targetModuleAlias.path;
  } else {
    absolutePathToTargetModule = getPathToCurrentFileWithoutExtension(
      absolutePathTo(pathToCurrentModule, importDefinitionPath)
    );
  }

  return absolutePathToTargetModule;
}

function setCurrentAndTargetLevel({
  pathToCurrentModule,
  importDefinitionPath,
  configurationTree,
  absolutePathToTargetModule,
}) {
  const generalLevels = searchGeneralLevels(absolutePathToTargetModule, pathToCurrentModule);
  const moduleLevelName = currentAndTargetNameFolder({
    generalLevels,
    pathToCurrentModule,
    absolutePathToTargetModule,
  });
  const targetModuleLevel = setModuleByName(configurationTree, moduleLevelName.targetName);
  const currentModuleLevel = setModuleByName(configurationTree, moduleLevelName.currentName);
  const nearestGeneralLevel = setModuleByName(configurationTree, currentModuleLevel?.parent);

  currentModuleLevel ? (currentModuleLevel.path = getPathToCurrentFileWithoutExtension(pathToCurrentModule)) : "";
  targetModuleLevel ? (targetModuleLevel.path = absolutePathToTargetModule) : "";
  nearestGeneralLevel ? (nearestGeneralLevel.path = currentModuleLevel.path) : "";
  
  const currentModuleLevelNotSpecifiedInTheRules = currentModuleLevel === undefined;
  const targetModuleLevelNotSpecifiedInTheRules = targetModuleLevel === undefined;

  if (currentModuleLevelNotSpecifiedInTheRules && targetModuleLevelNotSpecifiedInTheRules) {
    const currentModuleLevel = Object.assign(
      {},
      setLevelsModule({generalLevels, path: getPathToCurrentFileWithoutExtension(pathToCurrentModule), configurationTree})
    );
    const targetModuleLevel = Object.assign(
      {},
      setLevelsModule({generalLevels, path: absolutePathTo(pathToCurrentModule, importDefinitionPath), configurationTree})
    );
    const nearestGeneralLevel = setModuleByName(configurationTree, currentModuleLevel?.parent);

    targetModuleLevel.path = getPathToCurrentFileWithoutExtension(pathToCurrentModule);
    currentModuleLevel.path = absolutePathToTargetModule;
    nearestGeneralLevel.path = targetModuleLevel.path;

    return {
      currentModuleLevel: currentModuleLevel,
      targetModuleLevel: targetModuleLevel,
      nearestGeneralLevel: nearestGeneralLevel,
    };
  }

  if (currentModuleLevelNotSpecifiedInTheRules) {
    const levelsModule = setLevelsModule({
      generalLevels,
      path: getPathToCurrentFileWithoutExtension(pathToCurrentModule),
      configurationTree
    });
    const nearestGeneralLevel = setModuleByName(configurationTree, levelsModule?.parent);
    targetModuleLevel.name = levelsModule.name;
    return {
      currentModuleLevel: levelsModule,
      targetModuleLevel: targetModuleLevel,
      nearestGeneralLevel: nearestGeneralLevel,
    };
  }

  if (targetModuleLevelNotSpecifiedInTheRules) {
    const levelsModule = setLevelsModule({
      generalLevels,
      path: absolutePathTo(pathToCurrentModule, importDefinitionPath),
      configurationTree
    });
    const nearestGeneralLevel = setModuleByName(configurationTree, currentModuleLevel?.parent);
    levelsModule.path = absolutePathToTargetModule;
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

function currentAndTargetNameFolder({ generalLevels, pathToCurrentModule, absolutePathToTargetModule }) {
  const current = setNameModuleLevel(
    generalLevel(generalLevels),
    getPathToCurrentFileWithoutExtension(pathToCurrentModule)
  );
  const target = setNameModuleLevel(generalLevel(generalLevels), absolutePathToTargetModule);
  return { currentName: current, targetName: target };
}

function generalLevel(generalLevels) {
  return generalLevels[generalLevels.length - 1];
}

function searchGeneralLevels(targetModulePath, currentModulePath) {
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

function setLevelsModule({generalLevels, path, configurationTree}) {
  const currentLevel = setNameModuleLevel(generalLevel(generalLevels), path);
  const currentModuleLevel = setModuleByName(configurationTree, currentLevel);
  if (currentModuleLevel === undefined && generalLevels.length !== 0) {
    const result = generalLevels.slice(0, generalLevels.length - 1);
    return setLevelsModule({generalLevels: result, path, configurationTree});
  } else {
    return currentModuleLevel;
  }
}
