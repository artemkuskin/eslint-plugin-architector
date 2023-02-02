const lengthPathToFile = require("../helpers/lengthPathToFile");
const absolutePathToFile = require("../helpers/absolutePathToFile");
const PathToCurrentFileWithOutContent = require("../helpers/pathToCurrentFileWithoutContent");
const setModuleByName = require("../helpers/setModuleByName");
const isTargetModuleLevelAboveCurrentModuleLevel = require("../helpers/comparisonOfIndexes");
const isTargetModuleLevelDeeperThanCurrentModuleLevel = require("../helpers/comparisonOfLength");
const setCurrentLevel = require("../helpers/setCurrentLevel");
const searchNearestCurrentAndTargetLevel = require("../searchNearestCurrentAndTargetLevel");
module.exports = resultErrorMessage;

function resultErrorMessage(
  configurationTree,
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
  jsConfigFileContent
) {
  let errorMessage = undefined;

  const currentAndTargetLevel = searchNearestCurrentAndTargetLevel(
    importDefinitionPath,
    configurationTree,
    pathToCurrentModule,
    rootDirectory,
    jsConfigFileContent
  );

  console.log(currentAndTargetLevel);

  if (currentAndTargetLevel.currentModuleLevel.name !== currentAndTargetLevel.targetModuleLevel.name &&
    currentAndTargetLevel.currentModuleLevel.index < currentAndTargetLevel.targetModuleLevel.index) {
    errorMessage = `Cannot import ${currentAndTargetLevel.currentModuleLevel.name} from ${currentAndTargetLevel.targetModuleLevel.name}`;
  } 
  return errorMessage;
}

