const getModuleLevelByName = require("../serachByNameFolder/getModuleByName");
const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");
const getAbsolutePathTo = require("./absolutePathTo");
const getLowestGeneralLevel = require("./getLowestGeneralLevel");
const setNameModuleLevel = require("../serachByNameFolder/getNameFolder");
const getNameFolder = require("../serachByNameFolder/getNameFolder");
module.exports = getDataAboutTheCurrentLevelAndTargetLevel;

function getDataAboutTheCurrentLevelAndTargetLevel({
  pathToCurrentModule,
  importDefinitionPath,
  configurationTree,
  absolutePathToTargetModuleFolder,
  rootDirectory,
}) {
  const rootDirectoryTargetLevelExists = Boolean(getNameFolder(rootDirectory, absolutePathToTargetModuleFolder));
  if (rootDirectoryTargetLevelExists) {
    const generalLevels = getGeneralLevels(absolutePathToTargetModuleFolder, pathToCurrentModule);
    const modulesLevelName = getCurrentAndTargetFolderName({
      generalLevels,
      pathToCurrentModule,
      absolutePathToTargetModuleFolder,
    });
    const targetModuleLevel = getModuleLevelByName(configurationTree, modulesLevelName.targetName);
    const currentLevel = getModuleLevelByName(configurationTree, modulesLevelName.currentName);
    const nearestModuleLevelName = getNearestName(targetModuleLevel, currentLevel);
    const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestModuleLevelName);
    const currentModuleLevelNotSpecifiedInTheRules = Boolean(currentLevel === undefined);
    const targetModuleLevelNotSpecifiedInTheRules = Boolean(targetModuleLevel === undefined);
    const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(
      targetModuleLevel,
      currentLevel
    );
    if (currentModuleLevelNotSpecifiedInTheRules && targetModuleLevelNotSpecifiedInTheRules) {
      return getParentLevelorForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree({
        generalLevels,
        pathToCurrentModule,
        configurationTree,
        absolutePathToTargetModuleFolder,
      });
    }

    if (currentModuleLevelNotSpecifiedInTheRules) {
      return getParentLevelorForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree({
        generalLevels,
        pathToCurrentModule,
        configurationTree,
        targetModuleLevel,
      });
    }

    if (targetModuleLevelNotSpecifiedInTheRules) {
      return getParentLevelorForTargettLevelIfThereIsNoTargetLevelInConfigurationTree({
        generalLevels,
        configurationTree,
        currentLevel,
        absolutePathToTargetModuleFolder,
        rootDirectory,
        pathToCurrentModule,
        importDefinitionPath,
      });
    }

    return {
      currentLevel: currentLevel,
      targetModuleLevel: targetModuleLevel,
      nearestGeneralLevel: nearestGeneralLevel,
      isOneLevelOfNesting: isOneLevelOfNesting,
    };
  }
  return {
    currentLevel: undefined,
    targetModuleLevel: undefined,
    nearestGeneralLevel: undefined,
    isOneLevelOfNesting: undefined,
  };
}

function getParentLevelorForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree({
  generalLevels,
  pathToCurrentModule,
  configurationTree,
  absolutePathToTargetModuleFolder,
}) {
  const currentLevel = getModuleLevel({
    generalLevels,
    path: getPathToCurrentFileWithoutExtension(pathToCurrentModule),
    configurationTree,
  });

  const targetModuleLevel = getModuleLevel({
    generalLevels,
    path: absolutePathToTargetModuleFolder, //getAbsolutePathTo(pathToCurrentModule, importDefinitionPath),
    configurationTree,
  });

  const nearestModuleLevelName = getNearestName(targetModuleLevel, currentLevel);
  const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestModuleLevelName);
  const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(
    targetModuleLevel,
    currentLevel
  );
  return {
    currentLevel: currentLevel,
    targetModuleLevel: targetModuleLevel,
    nearestGeneralLevel: nearestGeneralLevel,
    isOneLevelOfNesting: isOneLevelOfNesting,
  };
}

function getParentLevelorForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree({
  generalLevels,
  pathToCurrentModule,
  configurationTree,
  targetModuleLevel,
}) {
  let levelsModule = getModuleLevel({
    generalLevels,
    path: pathToCurrentModule,
    configurationTree,
  });

  const nearestModuleLevelName = getNearestName(targetModuleLevel, levelsModule);
  const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestModuleLevelName);
  const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(
    targetModuleLevel,
    levelsModule
  );

  return {
    currentLevel: levelsModule,
    targetModuleLevel: targetModuleLevel,
    nearestGeneralLevel: nearestGeneralLevel,
    isOneLevelOfNesting: isOneLevelOfNesting,
  };
}

function getParentLevelorForTargettLevelIfThereIsNoTargetLevelInConfigurationTree({
  generalLevels,
  configurationTree,
  currentLevel,
  absolutePathToTargetModuleFolder,
  rootDirectory,
  pathToCurrentModule,
  importDefinitionPath,
}) {
  let levelsModule = getModuleLevel({
    generalLevels,
    path: absolutePathToTargetModuleFolder,
    configurationTree,
  });

  const levelsModuleIsRoorDirectory = Boolean(levelsModule.name === rootDirectory);
  const nearestModuleLevelName = getNearestName(levelsModule, currentLevel);

  if (levelsModuleIsRoorDirectory) {
    levelsModule = getModuleLevel({
      generalLevels,
      path: getAbsolutePathTo(pathToCurrentModule, importDefinitionPath),
      configurationTree,
    });
  }

  const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestModuleLevelName);
  const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(
    levelsModule,
    currentLevel
  );
  return {
    currentLevel: currentLevel,
    targetModuleLevel: levelsModule,
    nearestGeneralLevel: nearestGeneralLevel,
    isOneLevelOfNesting: isOneLevelOfNesting,
  };
}

/**
 * находим все общие уровни
 */
function getGeneralLevels(targetModulePath, currentModulePath) {
  const targetModulPathArr = targetModulePath.split("/");
  const currentModulePatharr = getPathToCurrentFileWithoutExtension(currentModulePath).split("/");
  const generalLevels = targetModulPathArr.filter((x) => currentModulePatharr.indexOf(x) !== -1);
  return generalLevels;
} 

/**
 * находим текущий и целеыой уровни по первому общему эелементу
 */
function getCurrentAndTargetFolderName({ generalLevels, pathToCurrentModule, absolutePathToTargetModuleFolder }) {
  const current = setNameModuleLevel(
    getLowestGeneralLevel(generalLevels),
    getPathToCurrentFileWithoutExtension(pathToCurrentModule)
  );
  const target = setNameModuleLevel(getLowestGeneralLevel(generalLevels), absolutePathToTargetModuleFolder);
  return { currentName: current, targetName: target };
} 

/**
 * Здесь мы ищем первый уровень для модуля который указан в конфиге
 */
function getModuleLevel({ generalLevels, path, configurationTree }) {
  const nameModuleLevel = setNameModuleLevel(getLowestGeneralLevel(generalLevels), path);
  const moduleLevel = getModuleLevelByName(configurationTree, nameModuleLevel);

  if (moduleLevel === undefined && generalLevels.length !== 0) {
    const result = generalLevels.slice(0, generalLevels.length - 1);
    return getModuleLevel({ generalLevels: result, path, configurationTree });
  } else {
    return { ...moduleLevel };
  }
}

function getNearestName(targetModuleLevel, currentLevel) {
  if (targetModuleLevel && currentLevel) {
    return targetModuleLevel.architectorPath.split("/").length > currentLevel.architectorPath.split("/").length
      ? currentLevel.name
      : targetModuleLevel.name;
  }
}

/**
 *  таргет и каррент на одном уровне вложенности?
 */
function targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(targetModuleLevel, currentModuleLevel) {
  if (targetModuleLevel && currentModuleLevel) {
    return (
      getPathToCurrentFileWithoutExtension(targetModuleLevel.architectorPath) ===
      getPathToCurrentFileWithoutExtension(currentModuleLevel.architectorPath)
    );
  }
}
