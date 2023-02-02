const path = require("path");
const getParentFolder = require("./src/helpers/getParentFolder");
const returnAnErrorForThisImport = require("./src/rules/returnAnErrorForThisImport");

module.exports = validateIfImportIsAllowed;

let jsConfigFileContent = undefined;

function validateIfImportIsAllowed(pathToCurrentModule, importDefinitionPath, levelsConfiguration, rootDirectory) {
  if (jsConfigFileContent === undefined) {
    setJsConfigFile();
  }

  let errorMessage = undefined

  const moduleIsInRootDirectory = Boolean(getParentFolder(rootDirectory, pathToCurrentModule));

  if (moduleIsInRootDirectory) {
    errorMessage = returnAnErrorForThisImport(
      rootDirectory,
      importDefinitionPath,
      pathToCurrentModule,
      levelsConfiguration,
      jsConfigFileContent
    );
  }

  return errorMessage
}

function setJsConfigFile() {
  try {
    jsConfigFileContent = require(path.resolve("jsconfig.json"));
  } catch {
    jsConfigFileContent = null;
  }
}
