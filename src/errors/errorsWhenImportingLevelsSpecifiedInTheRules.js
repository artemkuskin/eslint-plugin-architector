const lengthPathToFile = require("../helpers/lengthPathToFile");
const absolutePathToFile = require("../helpers/absolutePathToFile");
const PathToCurrentFileWithOutContent = require("../helpers/pathToCurrentFileWithoutContent");
const setModuleByName = require("../helpers/setModuleByName");
const isTargetModuleLevelAboveCurrentModuleLevel = require("../helpers/comparisonOfIndexes");
const isTargetModuleLevelDeeperThanCurrentModuleLevel = require("../helpers/comparisonOfLength");
const setCurrentLevel = require("../helpers/setCurrentLevel");
module.exports = outputOfErrorsWhenImportingLevelsSpecifiedInTheRules;

function outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
  currentModuleLevelConfiguration,
  configurationOfTargetModule,
  importLevel,
  currentModuleLevel,
  configurationTree,
  importDefinitionPath,
  pathToCurrentModule
) {
  let errorMessage = undefined;
  const currentModuleLevel1 = setCurrentLevel(pathToCurrentModule)
  console.log(currentModuleLevel1);
  // const firstParentCurrentModuleLevelConfiguration = setModuleByName(
  //   configurationTree,
  //   currentModuleLevelConfiguration.firstParent
  // );
  // const firstParentConfigurationOfTargetModule = setModuleByName(
  //   configurationTree,
  //   configurationOfTargetModule.firstParent
  // );
  // const absolutePathToTargetModule = absolutePathTo(pathToCurrentModule, importDefinitionPath);
  

  // const currentAndTargetModulesAreChildrenOfTheSameNearestLevel = areNearestParentsEqual(configurationOfTargetModule, currentModuleLevelConfiguration);
  // const currentAndTargetModulesAreChildrenOfTheSameRootLevel =  areRootParentsEqual(configurationOfTargetModule, currentModuleLevelConfiguration)

  // if (
  //   currentAndTargetModulesAreChildrenOfTheSameNearestLevel &&
  //   isTargetModuleLevelAboveCurrentModuleLevel(configurationOfTargetModule, currentModuleLevelConfiguration)
  // ) {
  //   errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  // } else if (
  //   currentAndTargetModulesAreChildrenOfTheSameRootLevel &&
  //   isTargetModuleLevelDeeperThanCurrentModuleLevel(pathToCurrentModule, absolutePathToTargetModule)
  // ) {
  //   errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  // } else if (
  //   ! currentAndTargetModulesAreChildrenOfTheSameRootLevel &&
  //   isTargetModuleLevelAboveCurrentModuleLevel(firstParentConfigurationOfTargetModule, firstParentCurrentModuleLevelConfiguration)
  // ) {
  //   errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  // }

  return errorMessage;
}

function areNearestParentsEqual (targetModule, currentModule) {
  return targetModule.parents === currentModule.parents
}

function areRootParentsEqual (targetModule, currentModule) {
  return targetModule.firstParent === currentModule.firstParent
}

function absolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(PathToCurrentFileWithOutContent(pathToModule), importDefinitionPath);
}
