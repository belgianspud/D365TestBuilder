import { testCases, type TestCase, type InsertTestCase } from "@shared/schema";

export interface IStorage {
  getTestCase(id: number): Promise<TestCase | undefined>;
  getTestCases(): Promise<TestCase[]>;
  createTestCase(testCase: InsertTestCase): Promise<TestCase>;
  updateTestCase(id: number, testCase: Partial<InsertTestCase>): Promise<TestCase | undefined>;
  deleteTestCase(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private testCases: Map<number, TestCase>;
  private currentId: number;

  constructor() {
    this.testCases = new Map();
    this.currentId = 1;
    
    // Add some sample data
    this.seedData();
  }

  private seedData() {
    const sampleTestCase: TestCase = {
      id: 1,
      name: "Account Creation Test Flow",
      description: "Creates a new account and verifies field values",
      nodes: [
        {
          id: "start",
          type: "start",
          position: { x: 50, y: 100 },
          data: { label: "Start" }
        },
        {
          id: "navigate-1",
          type: "navigate-record",
          position: { x: 300, y: 200 },
          data: { 
            label: "Navigate to Record",
            entity: "account",
            action: "create"
          }
        },
        {
          id: "setfield-1",
          type: "set-field",
          position: { x: 580, y: 300 },
          data: {
            label: "Set Field Value",
            entity: "account",
            field: "name",
            value: "Contoso Ltd"
          }
        },
        {
          id: "verify-1",
          type: "verify-field",
          position: { x: 860, y: 400 },
          data: {
            label: "Verify Field Contains",
            entity: "account",
            field: "name",
            expected: "Contoso Ltd"
          }
        }
      ],
      connections: [
        { id: "e1", source: "start", target: "navigate-1" },
        { id: "e2", source: "navigate-1", target: "setfield-1" },
        { id: "e3", source: "setfield-1", target: "verify-1" }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.testCases.set(1, sampleTestCase);
    this.currentId = 2;
  }

  async getTestCase(id: number): Promise<TestCase | undefined> {
    return this.testCases.get(id);
  }

  async getTestCases(): Promise<TestCase[]> {
    return Array.from(this.testCases.values());
  }

  async createTestCase(insertTestCase: InsertTestCase): Promise<TestCase> {
    const id = this.currentId++;
    const now = new Date();
    const testCase: TestCase = { 
      ...insertTestCase, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.testCases.set(id, testCase);
    return testCase;
  }

  async updateTestCase(id: number, updateData: Partial<InsertTestCase>): Promise<TestCase | undefined> {
    const existing = this.testCases.get(id);
    if (!existing) return undefined;
    
    const updated: TestCase = {
      ...existing,
      ...updateData,
      updatedAt: new Date()
    };
    this.testCases.set(id, updated);
    return updated;
  }

  async deleteTestCase(id: number): Promise<boolean> {
    return this.testCases.delete(id);
  }
}

export const storage = new MemStorage();
