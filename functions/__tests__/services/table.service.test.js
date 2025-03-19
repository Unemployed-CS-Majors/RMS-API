// __tests__/services/table.service.test.js
const TableService = require("../../app/services/table.service");
const { Table } = require("../../app/models/table.model");
const { db } = require("../../app/config/firebase.config");
const { mockDocumentSnapshot, mockQuerySnapshot } = require("../helpers");

jest.mock("../../app/config/firebase.config", () => ({
  db: {
    collection: jest.fn(),
  },
}));

describe("Table Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTable", () => {
    it("retrieves a table by ID successfully", async () => {
      const tableData = { id: "table1", seats: 4, status: "available" };
      const mockTableRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("table1", tableData)),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockTableRef) });

      const result = await TableService.getTable("table1");

      expect(result).toEqual(Table.fromFirestore(mockDocumentSnapshot("table1", tableData)));
    });

    it("returns null if table does not exist", async () => {
      const mockTableRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockTableRef) });

      const result = await TableService.getTable("table1");

      expect(result).toBeNull();
    });
  });

  describe("getAllTables", () => {
    it("retrieves all tables successfully", async () => {
      const tablesData = [
        { id: "table1", seats: 4, status: "available" },
        { id: "table2", seats: 2, status: "occupied" },
      ];
      const mockTablesRef = { get: jest.fn().mockResolvedValue(mockQuerySnapshot(tablesData)) };
      db.collection.mockReturnValue(mockTablesRef);

      const result = await TableService.getAllTables();

      expect(result).toEqual(
        tablesData.map((data) => Table.fromFirestore(mockDocumentSnapshot(data.id, data))),
      );
    });
  });

  describe("deleteTable", () => {
    it("deletes a table successfully", async () => {
      const mockTableRef = { delete: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockTableRef) });

      await TableService.deleteTable("table1");

      expect(mockTableRef.delete).toHaveBeenCalled();
    });
  });
});
