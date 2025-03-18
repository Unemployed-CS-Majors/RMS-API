// __tests__/helpers.js
const { db } = require('../app/config/firebase.config');

/**
 * Creates a mock Firestore document snapshot
 * @param {string} id - Document ID
 * @param {object} data - Document data
 * @returns {object} Mock document snapshot
 */
function mockDocumentSnapshot(id, data) {
    return {
        id,
        data: () => data,
        exists: !!data,
        ref: {
            id,
            path: `mock/path/${id}`
        }
    };
}

/**
 * Creates a mock Firestore query snapshot
 * @param {Array} docs - Array of document data objects with IDs
 * @returns {object} Mock query snapshot
 */
function mockQuerySnapshot(docs) {
    const snapshots = docs.map(doc => mockDocumentSnapshot(doc.id, doc));
    return {
        docs: snapshots,
        empty: snapshots.length === 0,
        size: snapshots.length,
        forEach: callback => snapshots.forEach(callback)
    };
}

/**
 * Mocks Firestore methods for a collection
 * @param {Array} docsArray - Array of document data to return
 * @returns {object} Mock collection methods
 */
function mockFirestoreCollection(docsArray = []) {
    const docs = Array.isArray(docsArray) ? docsArray : [];

    const mockDoc = jest.fn().mockImplementation(id => {
        const doc = docs.find(d => d.id === id) || { id };
        return {
            get: jest.fn().mockResolvedValue(mockDocumentSnapshot(id, doc.data)),
            set: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            delete: jest.fn().mockResolvedValue({}),
            collection: mockCollection
        };
    });

    const mockWhere = jest.fn().mockReturnThis();
    const mockOrderBy = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockReturnThis();

    const mockGet = jest.fn().mockResolvedValue(mockQuerySnapshot(docs));
    const mockAdd = jest.fn().mockImplementation(data => {
        const id = Math.random().toString(36).substring(2, 15);
        return Promise.resolve({
            id,
            get: () => Promise.resolve(mockDocumentSnapshot(id, data))
        });
    });

    const mockCollection = jest.fn().mockImplementation(() => ({
        doc: mockDoc,
        where: mockWhere,
        orderBy: mockOrderBy,
        limit: mockLimit,
        get: mockGet,
        add: mockAdd
    }));

    // Setup initial mocks on the db object
    db.collection = mockCollection;

    return {
        mockDoc,
        mockWhere,
        mockOrderBy,
        mockLimit,
        mockGet,
        mockAdd,
        mockCollection
    };
}

/**
 * Creates a mock Express request object
 * @param {object} options - Request options
 * @returns {object} Mock request object
 */
function mockRequest(options = {}) {
    const {
        body = {},
        params = {},
        query = {},
        headers = {},
        file = null,
        user = null,
    } = options;

    return {
        body,
        params,
        query,
        headers,
        file,
        user,
        get: jest.fn().mockImplementation(key => headers[key])
    };
}

/**
 * Creates a mock Express response object
 * @returns {object} Mock response object with spies
 */
function mockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    res.on = jest.fn().mockImplementation((event, callback) => {
        if (event === 'finish') setTimeout(callback, 0);
        return res;
    });
    return res;
}

/**
 * Resets all mocks used in tests
 */
function resetMocks() {
    jest.clearAllMocks();
}

module.exports = {
    mockDocumentSnapshot,
    mockQuerySnapshot,
    mockFirestoreCollection,
    mockRequest,
    mockResponse,
    resetMocks
};