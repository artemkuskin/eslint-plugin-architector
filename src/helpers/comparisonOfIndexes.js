function isTargetModulelevelAboveCurrentModuleLevel(targetModule, currentModule) {
    return targetModule.index >= currentModule.index;
  }

  module.exports = isTargetModulelevelAboveCurrentModuleLevel