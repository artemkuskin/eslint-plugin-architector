const searchNearestCurrentAndTargetLevel = require("../helpers/prepareDataForErrorOutput/searchNearestCurrentAndTargetLevel");
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
    if (currentAndTargetLevel.nearestGeneralLevel) {

      if (currentAndTargetLevel.currentModuleLevel.name !== currentAndTargetLevel.targetModuleLevel.name ) {
        
        if (currentAndTargetLevel.currentModuleLevel.index < currentAndTargetLevel.targetModuleLevel.index) {
            errorMessage = `Cannot import ${currentAndTargetLevel.currentModuleLevel.name} from ${currentAndTargetLevel.targetModuleLevel.name}`;

         }
        } else {
          if (currentAndTargetLevel.targetModuleLevel.path === currentAndTargetLevel.nearestGeneralLevel.path && 
            currentAndTargetLevel.currentModuleLevel.path !== currentAndTargetLevel.nearestGeneralLevel.path) {
              errorMessage = `ddddddddddddd`
            }
        }
       
      
    }
  return errorMessage;
}
