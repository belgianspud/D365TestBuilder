import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTestCaseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all test cases
  app.get("/api/test-cases", async (req, res) => {
    try {
      const testCases = await storage.getTestCases();
      res.json(testCases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch test cases" });
    }
  });

  // Get specific test case
  app.get("/api/test-cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid test case ID" });
      }
      
      const testCase = await storage.getTestCase(id);
      if (!testCase) {
        return res.status(404).json({ message: "Test case not found" });
      }
      
      res.json(testCase);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch test case" });
    }
  });

  // Create new test case
  app.post("/api/test-cases", async (req, res) => {
    try {
      const validatedData = insertTestCaseSchema.parse(req.body);
      const testCase = await storage.createTestCase(validatedData);
      res.status(201).json(testCase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid test case data",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create test case" });
    }
  });

  // Update test case
  app.put("/api/test-cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid test case ID" });
      }
      
      const validatedData = insertTestCaseSchema.partial().parse(req.body);
      const testCase = await storage.updateTestCase(id, validatedData);
      
      if (!testCase) {
        return res.status(404).json({ message: "Test case not found" });
      }
      
      res.json(testCase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid test case data",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to update test case" });
    }
  });

  // Delete test case
  app.delete("/api/test-cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid test case ID" });
      }
      
      const deleted = await storage.deleteTestCase(id);
      if (!deleted) {
        return res.status(404).json({ message: "Test case not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete test case" });
    }
  });

  // Run test case (mock execution)
  app.post("/api/test-cases/:id/run", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid test case ID" });
      }
      
      const testCase = await storage.getTestCase(id);
      if (!testCase) {
        return res.status(404).json({ message: "Test case not found" });
      }
      
      // Mock test execution results
      const results = {
        testCaseId: id,
        status: "passed",
        totalSteps: testCase.nodes.length,
        passedSteps: testCase.nodes.length,
        failedSteps: 0,
        executionTime: Math.random() * 5 + 1, // Random time between 1-6 seconds
        steps: testCase.nodes.map((node, index) => ({
          stepId: node.id,
          stepName: node.data.label,
          status: "passed",
          message: `Successfully executed ${node.data.label}`,
          executionTime: Math.random() * 1000 + 500 // Random time in ms
        }))
      };
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to run test case" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
