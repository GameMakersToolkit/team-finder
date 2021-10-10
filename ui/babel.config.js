module.exports = (api) => {
  const isTest = api.env("test");
  // we don't actually need babel for anything but tests
  if (!isTest) return;

  return {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-typescript",
    ],
  };
};
