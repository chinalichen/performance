const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        node: "current",
      },
      useBuiltIns: "usage",
    },
  ],
];

const plugins = [
  "@babel/plugin-transform-async-to-generator",

  "@babel/plugin-proposal-function-bind",

  "@babel/plugin-proposal-export-default-from",
  "@babel/plugin-proposal-logical-assignment-operators",
]

module.exports = {
  presets,
  plugins,
};