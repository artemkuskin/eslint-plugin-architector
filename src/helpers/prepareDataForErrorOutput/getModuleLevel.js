const getLowestGeneralLevel = require("./getLowestGeneralLevel");
const setNameModuleLevel = require("../serachByNameFolder/getNameFolder");
const getModuleLevelByName = require("../serachByNameFolder/getModuleByName");
module.exports = getModuleLevel;
/**
 * Здесь мы ищем первый уровень для модуля который указан в конфиге
 */
function getModuleLevel({ generalLevels, path, configurationTree }) {
  const nameModuleLevel = setNameModuleLevel(getLowestGeneralLevel(generalLevels), path);
  const moduleLevel = getModuleLevelByName(configurationTree, nameModuleLevel);

  if (moduleLevel === undefined && generalLevels.length !== 0) {
    const result = generalLevels.slice(0, generalLevels.length - 1);
    return getModuleLevel({ generalLevels: result, path, configurationTree });
  } else {
    return { ...moduleLevel };
  }
}
