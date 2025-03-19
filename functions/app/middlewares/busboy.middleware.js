const path = require("path");
const os = require("os");
const fs = require("fs");
const Busboy = require("busboy");
const { logger } = require("../logger/FirebaseLogger");

/**
 * Middleware to handle multipart/form-data uploads using Busboy
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 */
const busboyMiddleware = (req, res, next) => {
  if (req.method !== "POST" && req.method !== "PUT") {
    return next();
  }

  if (
    !req.headers["content-type"] ||
    !req.headers["content-type"].includes("multipart/form-data")
  ) {
    logger.info("Not a multipart request, skipping Busboy parser");
    return next();
  }

  logger.info("Processing multipart form with Busboy");

  const busboy = Busboy({ headers: req.headers });
  const tmpdir = os.tmpdir();

  const fields = {};

  let fileData = null;

  busboy.on("field", (fieldname, val) => {
    logger.info(
      `Processed field ${fieldname}: ${val.substring(0, 100)}${val.length > 100 ? "..." : ""}`
    );

    if (fieldname === "allergens" && val) {
      try {
        if (val.startsWith("[") && val.endsWith("]")) {
          fields[fieldname] = JSON.parse(val);
        } else {
          fields[fieldname] = val;
        }
      } catch (error) {
        logger.error("Error parsing allergens JSON:", error);
        fields[fieldname] = val;
      }
    } else {
      fields[fieldname] = val;
    }
  });

  const fileWrites = [];

  busboy.on("file", (fieldname, file, { filename, mimeType, encoding }) => {
    if (!filename) {
      logger.info(`No file provided for field ${fieldname}`);
      file.resume();
      return;
    }

    logger.info(`Processing file ${filename}, mimetype: ${mimeType}`);

    const filepath = path.join(tmpdir, `${Date.now()}_${filename}`);

    fileData = {
      fieldname,
      originalname: filename,
      encoding,
      mimetype: mimeType,
      path: filepath,
      size: 0,
    };

    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    const promise = new Promise((resolve, reject) => {
      file.on("end", () => {
        writeStream.end();
      });

      writeStream.on("finish", () => {
        const stats = fs.statSync(filepath);
        fileData.size = stats.size;

        fileData.buffer = fs.readFileSync(filepath);

        logger.info(`File processed: ${filename}, size: ${fileData.size} bytes`);
        resolve();
      });

      writeStream.on("error", (err) => {
        logger.error(`Error writing file: ${err}`);
        reject(err);
      });
    });

    fileWrites.push(promise);
  });

  busboy.on("finish", async () => {
    try {
      await Promise.all(fileWrites);

      req.body = fields;

      if (fileData) {
        req.file = fileData;

        fs.unlink(fileData.path, (err) => {
          if (err) {
            logger.error(`Error deleting temporary file: ${err}`);
          }
        });
      }

      if (req.body.averageWaitTime && !req.body.avgWaitTime) {
        req.body.avgWaitTime = req.body.averageWaitTime;
        logger.info(`Mapped averageWaitTime to avgWaitTime: ${req.body.avgWaitTime}`);
      }

      logger.info("Busboy parsing complete");
      logger.info(`Fields received: ${Object.keys(req.body).join(", ")}`);
      logger.info(`File received: ${req.file ? "Yes" : "No"}`);

      next();
    } catch (error) {
      logger.error("Error processing form data:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process form data",
        details: error.message,
      });
    }
  });

  busboy.on("error", (err) => {
    logger.error("Busboy error:", err);
    res.status(400).json({
      success: false,
      error: "Error parsing form data",
      details: err.message,
    });
  });

  if (req.rawBody) {
    // For Firebase Functions
    busboy.end(req.rawBody);
  } else {
    // For Express
    req.pipe(busboy);
  }
};

module.exports = busboyMiddleware;
