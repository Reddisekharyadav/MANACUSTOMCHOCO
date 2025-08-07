// Production database solution using your exported data
import wrapperData from '../../wrappers-export.json';
import adminData from '../../admins-export.json';

let mockDataInitialized = false;
const mockData = {
  wrappers: [] as unknown[],
  admins: [] as unknown[]
};

function initializeMockData() {
  if (!mockDataInitialized) {
    mockData.wrappers = [...wrapperData];
    mockData.admins = [...adminData];
    mockDataInitialized = true;
  }
}

export function createProductionDatabase() {
  initializeMockData();
  
  const mockCollection = (name: string) => ({
    find: () => ({
      sort: () => ({
        toArray: async () => mockData[name as keyof typeof mockData] || []
      }),
      toArray: async () => mockData[name as keyof typeof mockData] || []
    }),
    findOne: async (query: Record<string, unknown>) => {
      const items = mockData[name as keyof typeof mockData] || [];
      if (query._id) {
        return items.find((item: unknown) => (item as Record<string, unknown>)._id === query._id) || null;
      }
      if (query.username) {
        return items.find((item: unknown) => (item as Record<string, unknown>).username === query.username) || null;
      }
      return items[0] || null;
    },
    insertOne: async (doc: Record<string, unknown>) => {
      const items = mockData[name as keyof typeof mockData] || [];
      const newId = Date.now().toString();
      const newDoc = { ...doc, _id: newId };
      (items as Record<string, unknown>[]).push(newDoc);
      return { insertedId: newId };
    },
    insertMany: async (docs: Record<string, unknown>[]) => {
      const items = mockData[name as keyof typeof mockData] || [];
      const insertedIds = [];
      for (const doc of docs) {
        const newId = Date.now().toString();
        const newDoc = { ...doc, _id: newId };
        (items as Record<string, unknown>[]).push(newDoc);
        insertedIds.push(newId);
      }
      return { insertedIds };
    },
    updateOne: async (query: Record<string, unknown>, update: Record<string, unknown>) => {
      const items = mockData[name as keyof typeof mockData] || [];
      const typedItems = items as Record<string, unknown>[];
      const index = typedItems.findIndex((item: Record<string, unknown>) => item._id === query._id);
      if (index !== -1 && update.$set) {
        const currentItem = typedItems[index];
        const updateSet = update.$set as Record<string, unknown>;
        typedItems[index] = { ...currentItem, ...updateSet };
        return { matchedCount: 1, modifiedCount: 1 };
      }
      return { matchedCount: 0, modifiedCount: 0 };
    },
    deleteOne: async (query: Record<string, unknown>) => {
      const items = mockData[name as keyof typeof mockData] || [];
      const typedItems = items as Record<string, unknown>[];
      const index = typedItems.findIndex((item: Record<string, unknown>) => item._id === query._id);
      if (index !== -1) {
        typedItems.splice(index, 1);
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    },
    countDocuments: async () => mockData[name as keyof typeof mockData]?.length || 0
  });

  const mockDb = {
    collection: mockCollection,
    admin: () => ({
      ping: async () => true
    })
  };

  return { client: null, db: mockDb };
}
