function validateCreateWall(req) {
  const { x1, y1, x2, y2 } = req.body;

  if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
    return "All fields are required";
  }

  if (!Number.isInteger(x1)) {
    return "x1 must be an integer";
  }

  if (!Number.isInteger(y1)) {
    return "y1 must be an integer";
  }

  if (!Number.isInteger(x2)) {
    return "x2 must be an integer";
  }

  if (!Number.isInteger(y2)) {
    return "y2 must be an integer";
  }

  return null;
}

function validateUpdateWall(req) {
  const { x1, y1, x2, y2 } = req.body;

  if (x1 === undefined && y1 === undefined && x2 === undefined && y2 === undefined) {
    return "At least one field is required";
  }

  if (x1 !== undefined && !Number.isInteger(x1)) {
    return "x1 must be an integer";
  }

  if (y1 !== undefined && !Number.isInteger(y1)) {
    return "y1 must be an integer";
  }

  if (x2 !== undefined && !Number.isInteger(x2)) {
    return "x2 must be an integer";
  }

  if (y2 !== undefined && !Number.isInteger(y2)) {
    return "y2 must be an integer";
  }

  return null;
}

module.exports = {
  validateCreateWall,
  validateUpdateWall,
};
