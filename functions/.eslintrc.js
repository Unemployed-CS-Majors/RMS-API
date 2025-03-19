module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "new-cap": "off",
    quotes: ["error", "double"],
    indent: ["error", 2],
    "object-curly-spacing": ["error", "always"],
    "max-len": ["error", { code: 120 }],
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
  overrides: [
    {
      files: [
        "functions/app/middlewares/busboy.middleware.js",
        "functions/app/routes/analytics.router.js",
        "functions/app/routes/auth.router.js",
        "functions/app/routes/door.router.js",
        "functions/app/routes/floorPlan.router.js",
        "functions/app/routes/menuItem.router.js",
        "functions/app/routes/openingHours.router.js",
        "functions/app/routes/order.router.js",
        "functions/app/routes/payment.router.js",
        "functions/app/routes/reservation.router.js",
        "functions/app/routes/restaurantConfig.router.js",
        "functions/app/routes/table.router.js",
        "functions/app/routes/user.router.js",
        "functions/app/routes/wall.router.js",
        "functions/app/routes/window.router.js",
      ],
      rules: {
        "new-cap": "off",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
};
