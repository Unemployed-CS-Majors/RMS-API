/**
 * Validates the request to create a table.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {number} req.body.seats - The number of seats at the table.
 * @param {boolean} req.body.nextToWindow - Indicates if the table is next to a window.
 * @returns {string|null} An error message if validation fails, otherwise null.
 */
function validateCreateTable(req) {
  const { seats, nextToWindow, x, y, rotation, type, tableNum } = req.body;

  if (
    seats === undefined ||
    nextToWindow === undefined ||
    x === undefined ||
    y === undefined ||
    rotation === undefined ||
    type === undefined ||
    tableNum === undefined
  ) {
    return "All fields are required";
  }

  if (!Number.isInteger(seats)) {
    return "Seats must be an integer";
  }

  if (typeof nextToWindow !== "boolean") {
    return "z to window must be a boolean";
  }

  if (!Number.isInteger(x)) {
    return "x must be an integer";
  }

  if (!Number.isInteger(y)) {
    return "y must be an integer";
  }

  if (!Number.isInteger(rotation)) {
    return "rotation must be an integer";
  }

  if (typeof type !== "string") {
    return "type must be a string";
  }

  if (!Number.isInteger(tableNum)) {
    return "tableNum must be an integer";
  }

  return null;
}

module.exports = {
  validateCreateTable,
};
