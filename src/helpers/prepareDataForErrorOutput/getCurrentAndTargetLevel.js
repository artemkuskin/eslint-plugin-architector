const getModuleByName = require("../serachByNameFolder/setModuleByName");
const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");
const getAbsolutePathTo = require("./absolutePathTo");
const getGeneralLevel = require("./getGeneralLevel");
const setNameModuleLevel = require("../serachByNameFolder/getNameFolder");
module.exports = getAllTheDataAboutTheCurrentLevelAndTargetLevel;

function getAllTheDataAboutTheCurrentLevelAndTargetLevel({
  pathToCurrentModule,
  importDefinitionPath,
  configurationTree,
  absolutePathToTargetModule,
  rootDirectory,
}) {
  const generalLevels = getGeneralLevels(absolutePathToTargetModule, pathToCurrentModule);
  const moduleLevelName = getCurrentAndTargetFolderName({
    generalLevels,
    pathToCurrentModule,
    absolutePathToTargetModule,
  });

  const targetModuleLevel = getModuleByName(configurationTree, moduleLevelName.targetName);
  const currentModuleLevel = getModuleByName(configurationTree, moduleLevelName.currentName);
  const nearestName = getNearestName (targetModuleLevel, currentModuleLevel)
  const nearestGeneralLevel = getModuleByName(configurationTree, nearestName);

  const currentModuleLevelNotSpecifiedInTheRules = Boolean(currentModuleLevel === undefined);
  const targetModuleLevelNotSpecifiedInTheRules = Boolean(targetModuleLevel === undefined);
  const check = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel (targetModuleLevel, currentModuleLevel)

  if (currentModuleLevelNotSpecifiedInTheRules && targetModuleLevelNotSpecifiedInTheRules) {
    return getParentLevelForErrorHandlingInTheAbsenceOfTheCurrentLevelAndTargetLevelInConfigurationTree({
      generalLevels,
      pathToCurrentModule,
      importDefinitionPath,
      configurationTree,
      absolutePathToTargetModule,
    });
  }

  if (currentModuleLevelNotSpecifiedInTheRules) {
    return getParentLevelForErrorHandlingInTheAbsenceOfTheCurrentLevelInConfigurationTree({
      generalLevels,
      pathToCurrentModule,
      configurationTree,
      rootDirectory,
      targetModuleLevel,
    });
  }

  if (targetModuleLevelNotSpecifiedInTheRules) {
    return getParentLevelForErrorHandlingInTheAbsenceOfTheTargetLevelInConfigurationTree({
      generalLevels,
      configurationTree,
      currentModuleLevel,
      absolutePathToTargetModule,
      rootDirectory,
      pathToCurrentModule,
      importDefinitionPath,
    });
  }
  return {
    currentModuleLevel: currentModuleLevel,
    targetModuleLevel: targetModuleLevel,
    nearestGeneralLevel: nearestGeneralLevel,
    check: check
  };
}

function getParentLevelForErrorHandlingInTheAbsenceOfTheCurrentLevelAndTargetLevelInConfigurationTree({
  generalLevels,
  pathToCurrentModule,
  importDefinitionPath,
  configurationTree,
  absolutePathToTargetModule,
}) {
  const currentModuleLevel = {
    ...getModuleLevel({
      generalLevels,
      path: getPathToCurrentFileWithoutExtension(pathToCurrentModule),
      configurationTree,
    }),
  };

  const targetModuleLevel = {
    ...getModuleLevel({
      generalLevels,
      path: absolutePathToTargetModule,//getAbsolutePathTo(pathToCurrentModule, importDefinitionPath),
      configurationTree,
    }),
  };

  const nearestName =getNearestName (targetModuleLevel, currentModuleLevel)

  const nearestGeneralLevel = getModuleByName(configurationTree, nearestName);
  const check = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel (targetModuleLevel, currentModuleLevel)
  return {
    currentModuleLevel: currentModuleLevel,
    targetModuleLevel: targetModuleLevel,
    nearestGeneralLevel: nearestGeneralLevel,
    check: check
  };
}

function getParentLevelForErrorHandlingInTheAbsenceOfTheCurrentLevelInConfigurationTree({
  generalLevels,
  pathToCurrentModule,
  configurationTree,
  rootDirectory,
  targetModuleLevel,
}) {
  let levelsModule = {
    ...getModuleLevel({
      generalLevels,
      path: getPathToCurrentFileWithoutExtension(pathToCurrentModule),
      configurationTree,
    }),
  };

  const levelsModuleIsRoorDirectory = Boolean(levelsModule.name === rootDirectory);
  const moduleNotFoundByName = !levelsModule.name;
  if (levelsModuleIsRoorDirectory || moduleNotFoundByName) {
    levelsModule = {
      ...getModuleLevel({
        generalLevels,
        path: pathToCurrentModule,
        configurationTree,
      }),
    };
  }
  // const differentParentLevels = Boolean(levelsModule.parent !== targetModuleLevel.parent);
  const nearestName = getNearestName (targetModuleLevel, levelsModule)
  const nearestGeneralLevel = getModuleByName(configurationTree, nearestName);
  const check = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel (targetModuleLevel, levelsModule)
  // if (differentParentLevels) {
  //   targetModuleLevel.name = levelsModule.name;
  // }
  
  return {
    currentModuleLevel: levelsModule,
    targetModuleLevel: targetModuleLevel,
    nearestGeneralLevel: nearestGeneralLevel,
    check: check
  };
}

function getParentLevelForErrorHandlingInTheAbsenceOfTheTargetLevelInConfigurationTree({
  generalLevels,
  configurationTree,
  currentModuleLevel,
  absolutePathToTargetModule,
  rootDirectory,
  pathToCurrentModule,
  importDefinitionPath,
}) {
  let levelsModule = {
    ...getModuleLevel({
      generalLevels,
      path: absolutePathToTargetModule,
      configurationTree,
    }),
  };
  const moduleNotFoundByName = !levelsModule.name;
  const levelsModuleIsRoorDirectory = Boolean(levelsModule.name === rootDirectory);
  const nearestName = getNearestName (levelsModule, currentModuleLevel)
  if (levelsModuleIsRoorDirectory || moduleNotFoundByName) {
    levelsModule = {
      ...getModuleLevel({
        generalLevels,
        path: getAbsolutePathTo(pathToCurrentModule, importDefinitionPath),
        configurationTree,
      }),
    };
  }
  const nearestGeneralLevel = { ...getModuleByName(configurationTree, nearestName) };
  // const differentParentLevels = Boolean(levelsModule.parent !== currentModuleLevel.parent);
  // if (differentParentLevels) {
  //   currentModuleLevel.name = levelsModule.name;
  // }
  const check = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel (levelsModule, currentModuleLevel)
  return {
    currentModuleLevel: currentModuleLevel,
    targetModuleLevel: levelsModule,
    nearestGeneralLevel: nearestGeneralLevel,
    check: check
  };
}

function getGeneralLevels(targetModulePath, currentModulePath) {
  const targetModulPathArr = targetModulePath.split("/");
  const currentModulePatharr = getPathToCurrentFileWithoutExtension(currentModulePath).split("/");
  const generalLevels = targetModulPathArr.filter((x) => currentModulePatharr.indexOf(x) !== -1);
  return generalLevels;
}//находим все общие уровни

function getCurrentAndTargetFolderName({ generalLevels, pathToCurrentModule, absolutePathToTargetModule }) {
  const current = setNameModuleLevel(
    getGeneralLevel(generalLevels),
    getPathToCurrentFileWithoutExtension(pathToCurrentModule)
  );
  const target = setNameModuleLevel(getGeneralLevel(generalLevels), absolutePathToTargetModule);
  return { currentName: current, targetName: target };
} //находим текущий и целеыой уровни по первому общему эелементу

function getModuleLevel({ generalLevels, path, configurationTree }) {
  const nameModuleLevel = setNameModuleLevel(getGeneralLevel(generalLevels), path);
  const moduleLevel = getModuleByName(configurationTree, nameModuleLevel);
  console.log(generalLevels);
  if (moduleLevel === undefined && generalLevels.length !== 0) {
    const result = generalLevels.slice(0, generalLevels.length - 1);
    return getModuleLevel({ generalLevels: result, path, configurationTree });
  } else {
    return moduleLevel;
  }
} //Здесь мы ищем первый уровень для модуля который указан в конфиге

function getNearestName (targetModuleLevel, currentModuleLevel) {
  return targetModuleLevel?.architectorPath.split('/').length > currentModuleLevel?.architectorPath.split('/').length
  ? currentModuleLevel?.name
  : targetModuleLevel?.name
}

function targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel (targetModuleLevel, currentModuleLevel) {

return getPathToCurrentFileWithoutExtension(targetModuleLevel.architectorPath) === getPathToCurrentFileWithoutExtension(currentModuleLevel.architectorPath)
}//таргет и каррент на одном уровне вложенности?