import { apiResponseSchema, type ReceiptData } from "@shared/schema";

const API_CONFIG = {
  baseUrl: 'https://script.google.com/macros/s/AKfycbzg_q9wJGeF0b-nlqZsQoQ2GbALv-c_0cVkoPvCAc08Mvjn7W_ymskSBkefGQU95ZxdBg/exec',
  token: import.meta.env.VITE_API_TOKEN || '1458600036423'
};

export async function fetchReceiptData(refCode: string): Promise<ReceiptData> {
  try {
    const url = `${API_CONFIG.baseUrl}?action=get&ref=${encodeURIComponent(refCode)}&token=${API_CONFIG.token}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();
    const validatedData = apiResponseSchema.parse(rawData);
    
    if (!validatedData.ok) {
      throw new Error(validatedData.error || 'ไม่สามารถดึงข้อมูลได้');
    }
    
    if (!validatedData.data) {
      throw new Error('ไม่พบข้อมูลใบเสร็จ');
    }
    
    return validatedData.data;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('เกิดข้อผิดพลาดในการเชื่อมต่อ API');
  }
}

export async function testApiConnection(): Promise<boolean> {
  try {
    const url = `${API_CONFIG.baseUrl}?action=ping&token=${API_CONFIG.token}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.ok && data.data?.pong;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}
