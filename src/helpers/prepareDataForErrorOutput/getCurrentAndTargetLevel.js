const getModuleByName = require("../serachByNameFolder/setModuleByName");
const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");
const absolutePathTo = require("./absolutePathTo");
const getGeneralLevel = require("./getGeneralLevel");
const setNameModuleLevel = require("../serachByNameFolder/getNameFolder");
module.exports = getCurrentAndTargetLevel;

function getCurrentAndTargetLevel({
  pathToCurrentModule,
  importDefinitionPath,
  configurationTree,
  absolutePathToTargetModule,
}) {
  const generalLevels = searchGeneralLevels(absolutePathToTargetModule, pathToCurrentModule);
  const moduleLevelName = getCurrentAndTargetNameFolder({
    generalLevels,
    pathToCurrentModule,
    absolutePathToTargetModule,
  });

  const targetModuleLevel = getModuleByName(configurationTree, moduleLevelName.targetName);
  const currentModuleLevel = getModuleByName(configurationTree, moduleLevelName.currentName);
  const nearestGeneralLevel = getModuleByName(configurationTree, currentModuleLevel?.parent);

  currentModuleLevel ? (currentModuleLevel.path = getPathToCurrentFileWithoutExtension(pathToCurrentModule)) : "";
  targetModuleLevel ? (targetModuleLevel.path = absolutePathToTargetModule) : "";
  nearestGeneralLevel ? (nearestGeneralLevel.path = currentModuleLevel.path) : "";

  const currentModuleLevelNotSpecifiedInTheRules = Boolean(currentModuleLevel === undefined);
  const targetModuleLevelNotSpecifiedInTheRules = Boolean(targetModuleLevel === undefined);

  if (currentModuleLevelNotSpecifiedInTheRules && targetModuleLevelNotSpecifiedInTheRules) {
    const currentModuleLevel = Object.assign(
      {},
      getLevelsModule({
        generalLevels,
        path: getPathToCurrentFileWithoutExtension(pathToCurrentModule),
        configurationTree,
      })
    );
    const targetModuleLevel = Object.assign(
      {},
      getLevelsModule({
        generalLevels,
        path: absolutePathTo(pathToCurrentModule, importDefinitionPath),
        configurationTree,
      })
    );
    const nearestGeneralLevel = getModuleByName(configurationTree, currentModuleLevel?.parent);

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
    const levelsModule = getLevelsModule({
      generalLevels,
      path: getPathToCurrentFileWithoutExtension(pathToCurrentModule),
      configurationTree,
    });
    const nearestGeneralLevel = getModuleByName(configurationTree, levelsModule?.parent);
    targetModuleLevel.name = levelsModule.name;
    return {
      currentModuleLevel: levelsModule,
      targetModuleLevel: targetModuleLevel,
      nearestGeneralLevel: nearestGeneralLevel,
    };
  }

  if (targetModuleLevelNotSpecifiedInTheRules) {
    const levelsModule = getLevelsModule({
      generalLevels,
      path: absolutePathTo(pathToCurrentModule, importDefinitionPath),
      configurationTree,
    });
    const nearestGeneralLevel = getModuleByName(configurationTree, currentModuleLevel?.parent);
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

function searchGeneralLevels(targetModulePath, currentModulePath) {
  const targetModulPathArr = targetModulePath.split("/");
  const currentModulePatharr = getPathToCurrentFileWithoutExtension(currentModulePath).split("/");
  const generalLevels = targetModulPathArr.filter((x) => currentModulePatharr.indexOf(x) !== -1);
  return generalLevels;
}

function getCurrentAndTargetNameFolder({ generalLevels, pathToCurrentModule, absolutePathToTargetModule }) {
  const current = setNameModuleLevel(
    getGeneralLevel(generalLevels),
    getPathToCurrentFileWithoutExtension(pathToCurrentModule)
  );
  const target = setNameModuleLevel(getGeneralLevel(generalLevels), absolutePathToTargetModule);
  return { currentName: current, targetName: target };
}

function getLevelsModule({ generalLevels, path, configurationTree }) {
  const currentLevel = setNameModuleLevel(getGeneralLevel(generalLevels), path);
  const currentModuleLevel = getModuleByName(configurationTree, currentLevel);
  if (currentModuleLevel === undefined && generalLevels.length !== 0) {
    const result = generalLevels.slice(0, generalLevels.length - 1);
    return getLevelsModule({ generalLevels: result, path, configurationTree });
  } else {
    return currentModuleLevel;
  }
}
