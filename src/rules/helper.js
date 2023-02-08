const resultErrorMessage = require("../errors/resultErrorMessage");
const getParentFolder = require("../helpers/serachByNameFolder/getNameFolder");

module.exports = validateIfImportIsAllowed;

function validateIfImportIsAllowed(pathToCurrentModule, importDefinitionPath, levelsConfiguration, rootDirectory) {
  let errorMessage = undefined;
  const moduleIsInRootDirectory = Boolean(getParentFolder(rootDirectory, pathToCurrentModule));

  if (moduleIsInRootDirectory) {
    errorMessage = resultErrorMessage({
      importDefinitionPath,
      pathToCurrentModule,
      rootDirectory,
      levelsConfigurationFile: levelsConfiguration.file,
      levelsConfiguration,
    });
  }
  return errorMessage;
}
