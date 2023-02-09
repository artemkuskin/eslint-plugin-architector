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
  const nearestName =
    targetModuleLevel?.architectorPath > currentModuleLevel?.architectorPath
      ? currentModuleLevel?.name
      : targetModuleLevel?.name;
  const nearestGeneralLevel = getModuleByName(configurationTree, nearestName);

  const currentModuleLevelNotSpecifiedInTheRules = Boolean(currentModuleLevel === undefined);
  const targetModuleLevelNotSpecifiedInTheRules = Boolean(targetModuleLevel === undefined);

  // if (!currentModuleLevelNotSpecifiedInTheRules) {
  //   currentModuleLevel.path = getPathToCurrentFileWithoutExtension(pathToCurrentModule);
  //   nearestGeneralLevel.path = currentModuleLevel.path;
  // }

  // if (!targetModuleLevelNotSpecifiedInTheRules) {
  //   targetModuleLevel.path = absolutePathToTargetModule;
  // }

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
    console.log(123);
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
      path: getAbsolutePathTo(pathToCurrentModule, importDefinitionPath),
      configurationTree,
    }),
  };

  const nearestName =
    targetModuleLevel?.architectorPath > currentModuleLevel?.architectorPath
      ? currentModuleLevel?.name
      : targetModuleLevel?.name;

  const nearestGeneralLevel = getModuleByName(configurationTree, nearestName);
  // const isSameNearestParentLevel = Boolean(targetModuleLevel.name === currentModuleLevel.name);

  // if (isSameNearestParentLevel) {
  //   targetModuleLevel.path = absolutePathToTargetModule;
  //   currentModuleLevel.path = targetModuleLevel.path;
  //   nearestGeneralLevel.path = currentModuleLevel.path;
  // }

  return {
    currentModuleLevel: currentModuleLevel,
    targetModuleLevel: targetModuleLevel,
    nearestGeneralLevel: nearestGeneralLevel,
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

  const nearestName =
    targetModuleLevel?.architectorPath > levelsModule?.architectorPath ? levelsModule?.name : targetModuleLevel?.name;
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
  const differentParentLevels = Boolean(levelsModule.parent !== targetModuleLevel.parent);

  if (differentParentLevels) {
    targetModuleLevel.name = levelsModule.name;
  }

  const nearestGeneralLevel = getModuleByName(configurationTree, nearestName);
  // nearestGeneralLevel.path = levelsModule.path;
  return {
    currentModuleLevel: levelsModule,
    targetModuleLevel: targetModuleLevel,
    nearestGeneralLevel: nearestGeneralLevel,
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
  if (levelsModuleIsRoorDirectory || moduleNotFoundByName) {
    levelsModule = {
      ...getModuleLevel({
        generalLevels,
        path: getAbsolutePathTo(pathToCurrentModule, importDefinitionPath),
        configurationTree,
      }),
    };
  }
  const nearestName =
    levelsModule?.architectorPath > currentModuleLevel?.architectorPath ? currentModuleLevel?.name : levelsModule?.name;
  const nearestGeneralLevel = { ...getModuleByName(configurationTree, nearestName) };
  const differentParentLevels = Boolean(levelsModule.parent !== currentModuleLevel.parent);
  if (differentParentLevels) {
    currentModuleLevel.name = levelsModule.name;
  }

  // levelsModule.path = absolutePathToTargetModule;
  // nearestGeneralLevel.path = levelsModule.path;

  return {
    currentModuleLevel: currentModuleLevel,
    targetModuleLevel: levelsModule,
    nearestGeneralLevel: nearestGeneralLevel,
  };
}

function getGeneralLevels(targetModulePath, currentModulePath) {
  const targetModulPathArr = targetModulePath.split("/");
  const currentModulePatharr = getPathToCurrentFileWithoutExtension(currentModulePath).split("/");
  const generalLevels = targetModulPathArr.filter((x) => currentModulePatharr.indexOf(x) !== -1);
  return generalLevels;
}

function getCurrentAndTargetFolderName({ generalLevels, pathToCurrentModule, absolutePathToTargetModule }) {
  const current = setNameModuleLevel(
    getGeneralLevel(generalLevels),
    getPathToCurrentFileWithoutExtension(pathToCurrentModule)
  );
  const target = setNameModuleLevel(getGeneralLevel(generalLevels), absolutePathToTargetModule);
  return { currentName: current, targetName: target };
} //находим текущий и целеыой уровни по последнему общему эелементу

function getModuleLevel({ generalLevels, path, configurationTree }) {
  const nameModuleLevel = setNameModuleLevel(getGeneralLevel(generalLevels), path);
  const moduleLevel = getModuleByName(configurationTree, nameModuleLevel);
  if (moduleLevel === undefined && generalLevels.length !== 0) {
    const result = generalLevels.slice(0, generalLevels.length - 1);
    return getModuleLevel({ generalLevels: result, path, configurationTree });
  } else {
    return moduleLevel;
  }
} //Здесь мы ищем первый уровень для строки который указан в конфиге
