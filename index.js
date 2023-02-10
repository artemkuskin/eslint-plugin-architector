const validateHierarchy = require("./src/rules/helper");

const DEFAULT_HIERARCHY = {
  atoms: 0,
  molecules: 1,
  organisms: 2,
  templates: 3,
  pages: 4,
};

const DEFAULT_COMPONENTS_FOLDER = "components";

module.exports.rules = {
  "architector-import": {
    meta: {
      schema: [
        {
          type: "object",
          additionalProperties: true,
        },
        {
          type: "string",
        },
      ],
    },
    create: (context) => {
      const hierarchy = context.options[0] || DEFAULT_HIERARCHY;
      const componentFolder = context.options[1] || DEFAULT_COMPONENTS_FOLDER;
      return {
        ImportDeclaration: (node) =>
          v({
            node,
            hierarchy,
            componentFolder,
            context,
          }),
        VariableDeclaration: (node) =>
          a({
            node,
            hierarchy,
            componentFolder,
            context,
          }),
      };
    },
  },
};

function adaptingTheImportPathForLinux(path) {
  return path.split("\\").join("/");
}

function v({ node, hierarchy, componentFolder, context }) {
  // console.log(node);
  const fn = adaptingTheImportPathForLinux(context.getFilename());
  const nodeValue = adaptingTheImportPathForLinux(node.source.value);
  const params = {
    pathToCurrentModule: fn,
    importDefinitionPath: nodeValue,
    levelsConfiguration: hierarchy,
    rootDirectory: componentFolder,
  };
  const error = validateHierarchy(params);
  if (error) {
    context.report(node, error);
  }
}

function a({ node, hierarchy, componentFolder, context }) {
  if (node.declarations[0].init.arguments[0].value) {
    console.log(node.declarations[0].init.arguments[0].value);
  } else {
    return undefined;
  }
  // const fn = adaptingTheImportPathForLinux(context.getFilename());
  // const nodeValue = adaptingTheImportPathForLinux(node.declarations[0].init.arguments[0].value);
  // const params = {
  //   pathToCurrentModule: fn,
  //   importDefinitionPath: nodeValue,
  //   levelsConfiguration: hierarchy,
  //   rootDirectory: componentFolder,
  // };
  // const error = validateHierarchy(params);
  // if (error) {
  //   context.report(node, error);
  // }
}
