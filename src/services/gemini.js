import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getAIResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `أنت مساعد متجر TECHSTORE الإلكتروني. مهمتك الرد على استفسارات العملاء عن المنتجات والأسعار والشحن. إذا طلب العميل التحدث لمندوب بشري، رد عليه: "جاري تحويلك لمندوب المبيعات. يرجى ترك بريدك الإلكتروني وسيتم التواصل معك خلال دقائق."
    استفسار العميل: ${message}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "عذراً، حدث خطأ في الاتصال بالمساعد الذكي. حاول لاحقاً.";
  }
};
