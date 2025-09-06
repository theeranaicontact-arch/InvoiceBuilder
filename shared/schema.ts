import { z } from "zod";

// Receipt Info schema
export const receiptInfoSchema = z.object({
  ID: z.number(),
  NameSeller: z.string(),
  SellerAddress: z.string(),
  SellerTaxId: z.string(),
  BuyerName: z.string(),
  BuyerAddress: z.string(),
  BuyerTaxId: z.string(),
  BuyerOrgType: z.string(),
  RefCodeInfoItem: z.string(),
  CreateDate: z.string(),
  UpdateDate: z.string(),
  RecordId: z.string(),
});

// Receipt Item schema
export const receiptItemSchema = z.object({
  ID: z.number(),
  RefCodeInfoItem: z.string(),
  Item: z.string(),
  Amount: z.number(),
  Price: z.number(),
  WithholdingTax: z.number().default(0),
});

// Full receipt data schema
export const receiptDataSchema = z.object({
  info: receiptInfoSchema,
  items: z.array(receiptItemSchema),
});

// API response schemas
export const apiResponseSchema = z.object({
  ok: z.boolean(),
  data: receiptDataSchema.optional(),
  error: z.string().optional(),
});

// Search request schema
export const searchRequestSchema = z.object({
  refCode: z.string().min(1, "กรุณากรอกเลขที่เอกสาร"),
});

export type ReceiptInfo = z.infer<typeof receiptInfoSchema>;
export type ReceiptItem = z.infer<typeof receiptItemSchema>;
export type ReceiptData = z.infer<typeof receiptDataSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
export type SearchRequest = z.infer<typeof searchRequestSchema>;
