function validateCreateDoor(req) {
  const { x, y, width, height, rotation } = req.body;

  if (
    x === undefined ||
    y === undefined ||
    width === undefined ||
    height === undefined ||
    rotation === undefined
  ) {
    return "All fields are required";
  }

  if (!Number.isInteger(x)) {
    return "x must be an integer";
  }

  if (!Number.isInteger(y)) {
    return "y must be an integer";
  }

  if (!Number.isInteger(width)) {
    return "width must be an integer";
  }

  if (!Number.isInteger(height)) {
    return "height must be an integer";
  }

  if (!Number.isInteger(rotation)) {
    return "rotation must be an integer";
  }

  return null;
}

function validateUpdateDoor(req) {
  const { x, y, width, height, rotation } = req.body;

  if (
    x === undefined ||
    y === undefined ||
    width === undefined ||
    height === undefined ||
    rotation === undefined
  ) {
    return "All fields are required";
  }

  if (!Number.isInteger(x)) {
    return "x must be an integer";
  }

  if (!Number.isInteger(y)) {
    return "y must be an integer";
  }

  if (!Number.isInteger(width)) {
    return "width must be an integer";
  }

  if (!Number.isInteger(height)) {
    return "height must be an integer";
  }

  if (!Number.isInteger(rotation)) {
    return "rotation must be an integer";
  }

  return null;
}

module.exports = {
  validateCreateDoor,
  validateUpdateDoor,
};
