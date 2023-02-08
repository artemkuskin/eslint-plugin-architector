const validateHierarchy = require("../src/rules/helper");

describe("Validate hierarchy with default config", () => {
  const filePath = "/home/artem/my-app/src/A/A1/A2/A22/A22.jsx";

  const hierarchy = {
    file: [
      {
        level: "D",
        children: [],
      },

      {
        level: "A",
        children: [
          {
            level: "A1",
            children: [],
          },
          {
            level: "A3",
            children: [],
          },
        ],
      },
      {
        level: "B",
        children: [
          {
            level: "B1",
            children: [],
          },
        ],
      },
      {
        level: "C",
        children: [],
      },
    ],
  };

  const componentFolder = "src";

  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "../../../A", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "A/A", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "C/C.jsx", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "B3/B3", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "B1/B1", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "../../../../B/B", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "../../../../D", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "../A2", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "../../A1", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });

  it("allow downward import", () => {
    const errors = validateHierarchy("/home/artem/my-app/src/D.jsx", "./A/A.jsx", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy("/home/artem/my-app/src/D.jsx", "./A/A3/A3.jsx", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy("/home/artem/my-app/src/D.jsx", "./B/B", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy(
      "/home/artem/my-app/src/D.jsx",
      "./A/A1/A2/A22/A22.jsx",
      hierarchy,
      componentFolder
    );
    expect(errors).toEqual(undefined);
  });

  it("allow downward import", () => {
    const errors = validateHierarchy("/home/artem/my-app/src/A/A.jsx", "./A1/A1.jsx", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy("/home/artem/my-app/src/A/A.jsx", "./A1/A2/A2.jsx", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy("/home/artem/my-app/src/A/A.jsx", "A3/A3.jsx", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
});
