// __tests__/setup.js
const functions = require("firebase-functions-test");

// Initialize the firebase-functions-test SDK
const testEnv = functions({
  projectId: "restaurant-management-sy-1a0cd",
});

// Mock Firebase Admin SDK
jest.mock("firebase-admin", () => {
  return {
    initializeApp: jest.fn(),
  };
});

// Mock Firebase Admin Auth
jest.mock("firebase-admin/auth", () => {
  const auth = {
    createUser: jest.fn(),
    createCustomToken: jest.fn(),
    verifyIdToken: jest.fn(),
    generateEmailVerificationLink: jest.fn(),
    generatePasswordResetLink: jest.fn(),
    deleteUser: jest.fn(),
  };

  return {
    getAuth: jest.fn().mockReturnValue(auth),
  };
});

// Mock Firebase Admin Firestore
jest.mock("firebase-admin/firestore", () => {
  const firestore = {
    collection: jest.fn(),
    doc: jest.fn(),
    getAll: jest.fn(),
    batch: jest.fn(),
    runTransaction: jest.fn(),
  };

  return {
    getFirestore: jest.fn().mockReturnValue(firestore),
  };
});

// Mock Firebase Admin Storage
jest.mock("firebase-admin/storage", () => {
  const bucket = {
    file: jest.fn().mockReturnValue({
      save: jest.fn().mockResolvedValue({}),
      makePublic: jest.fn().mockResolvedValue({}),
      exists: jest.fn().mockResolvedValue([true]),
      delete: jest.fn().mockResolvedValue({}),
    }),
    name: "test-bucket",
  };

  const storage = {
    bucket: jest.fn().mockReturnValue(bucket),
  };

  return {
    getStorage: jest.fn().mockReturnValue(storage),
  };
});

// Mock Stripe
jest.mock("../app/config/stripe.config", () => {
  return {
    paymentIntents: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
    checkout: {
      sessions: {
        create: jest.fn(),
        retrieve: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  };
});

// Mock Axios
jest.mock("axios", () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

// Mock Mailjet
jest.mock("node-mailjet", () => ({
  apiConnect: jest.fn().mockReturnValue({
    post: jest.fn().mockReturnValue({
      request: jest.fn().mockResolvedValue({ body: { success: true } }),
    }),
  }),
}));

// Mock logger to avoid console spam during tests
jest.mock("../app/logger/FirebaseLogger", () => ({
  logger: {
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    critical: jest.fn(),
    setLogLevel: jest.fn(),
    httpMiddleware: jest.fn().mockReturnValue((req, res, next) => next()),
  },
  LogLevel: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    CRITICAL: 4,
    NONE: 5,
  },
  FirebaseLogger: jest.fn(),
}));

// Clean up after all tests are done
afterAll(() => {
  testEnv.cleanup();
});
