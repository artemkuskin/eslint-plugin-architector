const getModuleLevelByName = require("../serachByNameFolder/getModuleByName");
const getNameFolder = require("../serachByNameFolder/getNameFolder");
const getGeneralLevels = require("./getGeneralLevels");
const getCurrentAndTargetFolderName = require("./getCurrentAndTargetFolderName");
const targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel = require("./targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel");
const getNearestName = require("./getNearestName");
const getParentLevelorForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree = require("./getParentLevelorForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree");
const getParentLevelorForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree = require("./getParentLevelorForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree");
const getParentLevelorForTargettLevelIfThereIsNoTargetLevelInConfigurationTree = require("./getParentLevelorForTargettLevelIfThereIsNoTargetLevelInConfigurationTree");
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
    const targetLevel = getModuleLevelByName(configurationTree, modulesLevelName.targetName);
    const currentLevel = getModuleLevelByName(configurationTree, modulesLevelName.currentName);
    const nearestModuleLevelName = getNearestName(targetLevel, currentLevel);
    const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestModuleLevelName);
    const currentModuleLevelNotSpecifiedInTheRules = Boolean(currentLevel === undefined);
    const targetModuleLevelNotSpecifiedInTheRules = Boolean(targetLevel === undefined);
    const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(targetLevel, currentLevel);
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
        targetLevel,
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
      targetLevel: targetLevel,
      nearestGeneralLevel: nearestGeneralLevel,
      isOneLevelOfNesting: isOneLevelOfNesting,
    };
  }
  return {
    currentLevel: undefined,
    targetLevel: undefined,
    nearestGeneralLevel: undefined,
    isOneLevelOfNesting: undefined,
  };
}

// function getParentLevelorForCurrentLevelAndTArgetLevelIfThereIsNoCurrentLevelAndTargetLevelInConfigurationTree({
//   generalLevels,
//   pathToCurrentModule,
//   configurationTree,
//   absolutePathToTargetModuleFolder,
// }) {
//   const currentLevel = getModuleLevel({
//     generalLevels,
//     path: getPathToCurrentFileWithoutExtension(pathToCurrentModule),
//     configurationTree,
//   });

//   const targetLevel = getModuleLevel({
//     generalLevels,
//     path: absolutePathToTargetModuleFolder, //getAbsolutePathTo(pathToCurrentModule, importDefinitionPath),
//     configurationTree,
//   });

//   const nearestModuleLevelName = getNearestName(targetLevel, currentLevel);
//   const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestModuleLevelName);
//   const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(
//     targetLevel,
//     currentLevel
//   );
//   return {
//     currentLevel: currentLevel,
//     targetLevel: targetLevel,
//     nearestGeneralLevel: nearestGeneralLevel,
//     isOneLevelOfNesting: isOneLevelOfNesting,
//   };
// }

// function getParentLevelorForCurrentLevelIfThereIsNoCurrentLevelInConfigurationTree({
//   generalLevels,
//   pathToCurrentModule,
//   configurationTree,
//   targetLevel,
// }) {
//   let currentLevel = getModuleLevel({
//     generalLevels,
//     path: pathToCurrentModule,
//     configurationTree,
//   });

//   const nearestModuleLevelName = getNearestName(targetLevel, currentLevel);
//   const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestModuleLevelName);
//   const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(
//     targetLevel,
//     currentLevel
//   );

//   return {
//     currentLevel: currentLevel,
//     targetLevel: targetLevel,
//     nearestGeneralLevel: nearestGeneralLevel,
//     isOneLevelOfNesting: isOneLevelOfNesting,
//   };
// }

// function getParentLevelorForTargettLevelIfThereIsNoTargetLevelInConfigurationTree({
//   generalLevels,
//   configurationTree,
//   currentLevel,
//   absolutePathToTargetModuleFolder,
//   rootDirectory,
//   pathToCurrentModule,
//   importDefinitionPath,
// }) {
//   let targetLevel = getModuleLevel({
//     generalLevels,
//     path: absolutePathToTargetModuleFolder,
//     configurationTree,
//   });

//   const levelsModuleIsRoorDirectory = Boolean(targetLevel.name === rootDirectory);
//   const nearestModuleLevelName = getNearestName(targetLevel, currentLevel);

//   if (levelsModuleIsRoorDirectory) {
//     targetLevel = getModuleLevel({
//       generalLevels,
//       path: getAbsolutePathTo(pathToCurrentModule, importDefinitionPath),
//       configurationTree,
//     });
//   }

//   const nearestGeneralLevel = getModuleLevelByName(configurationTree, nearestModuleLevelName);
//   const isOneLevelOfNesting = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(
//     targetLevel,
//     currentLevel
//   );
//   return {
//     currentLevel: currentLevel,
//     targetLevel: targetLevel,
//     nearestGeneralLevel: nearestGeneralLevel,
//     isOneLevelOfNesting: isOneLevelOfNesting,
//   };
// }

// /**
//  * находим все общие уровни
//  */
// function getGeneralLevels(targetModulePath, currentModulePath) {
//   const targetModulPathArr = targetModulePath.split("/");
//   const currentModulePatharr = getPathToCurrentFileWithoutExtension(currentModulePath).split("/");
//   const generalLevels = targetModulPathArr.filter((x) => currentModulePatharr.indexOf(x) !== -1);
//   return generalLevels;
// }

// /**
//  * находим текущий и целеыой уровни по первому общему эелементу
//  */
// function getCurrentAndTargetFolderName({ generalLevels, pathToCurrentModule, absolutePathToTargetModuleFolder }) {
//   const current = setNameModuleLevel(
//     getLowestGeneralLevel(generalLevels),
//     getPathToCurrentFileWithoutExtension(pathToCurrentModule)
//   );
//   const target = setNameModuleLevel(getLowestGeneralLevel(generalLevels), absolutePathToTargetModuleFolder);
//   return { currentName: current, targetName: target };
// }

// /**
//  * Здесь мы ищем первый уровень для модуля который указан в конфиге
//  */
// function getModuleLevel({ generalLevels, path, configurationTree }) {
//   const nameModuleLevel = setNameModuleLevel(getLowestGeneralLevel(generalLevels), path);
//   const moduleLevel = getModuleLevelByName(configurationTree, nameModuleLevel);

//   if (moduleLevel === undefined && generalLevels.length !== 0) {
//     const result = generalLevels.slice(0, generalLevels.length - 1);
//     return getModuleLevel({ generalLevels: result, path, configurationTree });
//   } else {
//     return { ...moduleLevel };
//   }
// }

// function getNearestName(targetLevel, currentLevel) {
//   if (targetLevel && currentLevel) {
//     return targetLevel.architectorPath.split("/").length > currentLevel.architectorPath.split("/").length
//       ? currentLevel.name
//       : targetLevel.name;
//   }
// }

// /**
//  *  таргет и каррент на одном уровне вложенности?
//  */
// function targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(targetLevel, currentLevel) {
//   if (targetLevel && currentLevel) {
//     return (
//       getPathToCurrentFileWithoutExtension(targetLevel.architectorPath) ===
//       getPathToCurrentFileWithoutExtension(currentLevel.architectorPath)
//     );
//   }
// }
