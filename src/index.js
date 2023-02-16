const getErrorMessage = require("./errors/errorMessage");
const getNameFolder = require("./helpers/serachByNameFolder/getNameFolder");

module.exports = validateIfImportIsAllowed;

function validateIfImportIsAllowed({ pathToCurrentModule, importDefinitionPath, levelsConfiguration, rootDirectory }) {
  let errorMessage = undefined;

  const moduleIsInRootDirectory = Boolean(getNameFolder(rootDirectory, pathToCurrentModule));
  if (moduleIsInRootDirectory) {
    errorMessage = getErrorMessage({
      importDefinitionPath,
      pathToCurrentModule,
      rootDirectory,
      levelsConfigurationFile: levelsConfiguration.levels,
      levelsConfiguration,
    });
  }

  return errorMessage;
}
