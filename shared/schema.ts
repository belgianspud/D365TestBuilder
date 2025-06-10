import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const testCases = pgTable("test_cases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  nodes: jsonb("nodes").notNull().$type<FlowNode[]>(),
  connections: jsonb("connections").notNull().$type<FlowConnection[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTestCaseSchema = createInsertSchema(testCases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTestCase = z.infer<typeof insertTestCaseSchema>;
export type TestCase = typeof testCases.$inferSelect;

// Flow-specific types
export interface FlowNode {
  id: string;
  type: 'start' | 'navigate-record' | 'set-field' | 'click-button' | 'verify-field' | 'verify-visibility' | 'condition' | 'wait';
  position: { x: number; y: number };
  data: {
    label: string;
    entity?: string;
    field?: string;
    value?: string;
    action?: string;
    condition?: string;
    operator?: string;
    expected?: string;
    buttonType?: string;
    delay?: number;
  };
}

export interface FlowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}
