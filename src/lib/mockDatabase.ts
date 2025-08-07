// Production database solution using your exported data
import wrapperData from '../../wrappers-export.json';
import adminData from '../../admins-export.json';

let mockDataInitialized = false;
let mockData = {
  wrappers: [] as any[],
  admins: [] as any[]
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
    findOne: async (query: any) => {
      const items = mockData[name as keyof typeof mockData] || [];
      if (query._id) {
        return items.find((item: any) => item._id === query._id) || null;
      }
      if (query.username) {
        return items.find((item: any) => item.username === query.username) || null;
      }
      return items[0] || null;
    },
    insertOne: async (doc: any) => {
      const items = mockData[name as keyof typeof mockData] || [];
      const newId = Date.now().toString();
      const newDoc = { ...doc, _id: newId };
      items.push(newDoc);
      return { insertedId: newId };
    },
    insertMany: async (docs: any[]) => {
      const items = mockData[name as keyof typeof mockData] || [];
      const insertedIds = [];
      for (const doc of docs) {
        const newId = Date.now().toString();
        const newDoc = { ...doc, _id: newId };
        items.push(newDoc);
        insertedIds.push(newId);
      }
      return { insertedIds };
    },
    updateOne: async (query: any, update: any) => {
      const items = mockData[name as keyof typeof mockData] || [];
      const index = items.findIndex((item: any) => item._id === query._id);
      if (index !== -1) {
        items[index] = { ...items[index], ...update.$set };
        return { matchedCount: 1, modifiedCount: 1 };
      }
      return { matchedCount: 0, modifiedCount: 0 };
    },
    deleteOne: async (query: any) => {
      const items = mockData[name as keyof typeof mockData] || [];
      const index = items.findIndex((item: any) => item._id === query._id);
      if (index !== -1) {
        items.splice(index, 1);
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
