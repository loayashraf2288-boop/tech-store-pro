import OpenAI from "openai";

const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

export const openai = new OpenAI({
  apiKey: apiKey || "missing",
  baseURL: baseURL || undefined,
});

export const aiAvailable = Boolean(baseURL && apiKey);

const SYSTEM_PROMPT = `أنت مساعد دعم العملاء لمتجر TECHSTORE الإلكتروني المتخصص في بيع الأجهزة التقنية (هواتف، لابتوبات، سماعات، شاشات، أجهزة لوحية، إكسسوارات).
- تجاوب باللغة العربية الفصحى المبسطة بأسلوب ودود ومحترم.
- ساعد الزبون في اختيار المنتج، تتبع الطلب، سياسة الإرجاع، طرق الدفع، والشحن.
- TECHSTORE تقدم شحن سريع، ضمان استرجاع 14 يوم، دفع آمن (نقد عند الاستلام أو بطاقة)، ودعم فني 24/7.
- إذا سأل الزبون عن شيء غير متعلق بالتسوق، حوّل الموضوع بلطف.
- اجعل ردودك قصيرة ومفيدة.`;

export async function getAiReply(history: Array<{ role: string; text: string }>, userText: string): Promise<string> {
  if (!aiAvailable) {
    return "خدمة الذكاء الاصطناعي غير متاحة حالياً، الرجاء التحدث مع موظف الدعم.";
  }
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-10).map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      })),
      { role: "user", content: userText },
    ];
    const res = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages,
    });
    return res.choices[0]?.message?.content?.trim() || "عذراً، لم أتمكن من الرد حالياً.";
  } catch (err) {
    console.error("AI reply error", err);
    return "عذراً، حدث خطأ أثناء معالجة طلبك. يمكنك التحدث مع موظف الدعم.";
  }
}
