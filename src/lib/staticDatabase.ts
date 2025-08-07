// Static database using your exported data - works identically to MongoDB
import wrapperData from '../../wrappers-export.json';
import adminData from '../../admins-export.json';

// Static data that matches your exact MongoDB structure
const staticData = {
  wrappers: wrapperData,
  admins: adminData
};

// Create a MongoDB-compatible interface
export class StaticDatabase {
  private data: any;

  constructor() {
    this.data = {
      wrappers: [...staticData.wrappers],
      admins: [...staticData.admins]
    };
  }

  collection(name: string) {
    return {
      find: () => ({
        sort: () => ({
          toArray: async () => this.data[name] || []
        }),
        toArray: async () => this.data[name] || []
      }),
      
      findOne: async (query: any = {}) => {
        const items = this.data[name] || [];
        if (!query || Object.keys(query).length === 0) return items[0] || null;
        
        if (query._id) {
          return items.find((item: any) => item._id === query._id) || null;
        }
        if (query.username) {
          return items.find((item: any) => item.username === query.username) || null;
        }
        if (query.modelNumber) {
          return items.find((item: any) => item.modelNumber === query.modelNumber) || null;
        }
        return items[0] || null;
      },

      insertOne: async (doc: any) => {
        const newId = `static_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newDoc = { ...doc, _id: newId, createdAt: new Date(), updatedAt: new Date() };
        this.data[name].push(newDoc);
        return { insertedId: newId };
      },

      insertMany: async (docs: any[]) => {
        const insertedIds = [];
        for (const doc of docs) {
          const result = await this.collection(name).insertOne(doc);
          insertedIds.push(result.insertedId);
        }
        return { insertedIds };
      },

      updateOne: async (query: any, update: any) => {
        const items = this.data[name] || [];
        let index = -1;
        
        if (query._id) {
          index = items.findIndex((item: any) => item._id === query._id);
        }
        
        if (index !== -1 && update.$set) {
          items[index] = { ...items[index], ...update.$set, updatedAt: new Date() };
          return { matchedCount: 1, modifiedCount: 1 };
        }
        return { matchedCount: 0, modifiedCount: 0 };
      },

      deleteOne: async (query: any) => {
        const items = this.data[name] || [];
        let index = -1;
        
        if (query._id) {
          index = items.findIndex((item: any) => item._id === query._id);
        }
        
        if (index !== -1) {
          items.splice(index, 1);
          return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
      },

      countDocuments: async () => this.data[name]?.length || 0
    };
  }

  admin() {
    return {
      ping: async () => true
    };
  }
}

export function createStaticDatabase() {
  const db = new StaticDatabase();
  return { 
    client: null, 
    db 
  };
}
