const getParentFolder = require("../helpers/serachByNameFolder/getNameFolder");
const returnAnErrorForThisImport = require("./returnAnErrorForThisImport");

module.exports = validateIfImportIsAllowed;

function validateIfImportIsAllowed(pathToCurrentModule, importDefinitionPath, levelsConfiguration, rootDirectory) {

  let errorMessage = undefined

  const moduleIsInRootDirectory = Boolean(getParentFolder(rootDirectory, pathToCurrentModule));

  if (moduleIsInRootDirectory) {
    errorMessage = returnAnErrorForThisImport(
      rootDirectory,
      importDefinitionPath,
      pathToCurrentModule,
      levelsConfiguration,
    );
  }

  return errorMessage
}

