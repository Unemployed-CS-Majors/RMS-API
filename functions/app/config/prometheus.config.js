const promBundle = require("express-prom-bundle");

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: "RMS-API", project_type: "rest_api" },
  promClient: {
    collectDefaultMetrics: {},
  },
});
module.exports = { metricsMiddleware };
