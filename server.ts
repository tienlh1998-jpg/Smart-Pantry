import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Warm up or lazy-initialize Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. Smart Suggester will fall back to mock recipes.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for recipe suggestions
  app.post("/api/suggest-recipe", async (req, res) => {
    try {
      const { ingredients, language } = req.body;
      const isEnglish = language !== "vi";

      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({
          error: isEnglish
            ? "No ingredients provided."
            : "Không có nguyên liệu nào được cung cấp.",
        });
      }

      // Format ingredients for the prompt
      const ingredientDetails = ingredients
        .map((ing: any) => `- ${ing.name} (expiring in ${ing.daysLeft} days)`)
        .join("\n");

      const systemPrompt = isEnglish
        ? "You are a Vietnamese master culinary chef. You help people reduce food waste by creating authentic, delicious, and easy-to-cook Vietnamese recipes using expiring ingredients. You MUST respond strictly in the requested JSON structure."
        : "Bạn là một đầu bếp Việt Nam chuyên nghiệp. Bạn giúp giảm lãng phí thực phẩm bằng cách đề xuất các công thức món ăn Việt Nam truyền thống, thơm ngon, dễ làm dựa trên các nguyên liệu sắp hết hạn. Bạn PHẢI phản hồi chính xác bằng cấu trúc JSON được yêu cầu.";

      const userPrompt = isEnglish
        ? `I have these ingredients close to expiration in my pantry:
${ingredientDetails}

Please suggest ONE classic or creative Vietnamese recipe that uses as many of these ingredients as possible. 
Response language MUST be English. Translate Vietnamese food names only phonetically/descriptively (e.g., "Phở Bò (Beef Noodle Soup)", "Đậu Hũ Sốt Cà Chua (Tofu in Tomato Sauce)").`
        : `Tôi có các nguyên liệu sau sắp hết hạn trong tủ bếp:
${ingredientDetails}

Hãy đề xuất MỘT món ăn Việt Nam thơm ngon (truyền thống hoặc sáng tạo) sử dụng tối đa các nguyên liệu trên.
Ngôn ngữ phản hồi PHẢI hoàn toàn bằng tiếng Việt (Ví dụ tên món ăn: "Thịt Kho Tàu", "Đậu Sốt Cà Chua").`;

      const apiKey = process.env.GEMINI_API_KEY;

      // Fallback if no API key is specified (for safety/offline development fallback, but we should make a real call if present)
      if (!apiKey) {
        console.warn("GEMINI_API_KEY is missing. Providing fallback delicious Vietnamese mock recipe.");
        const fallbackObj = isEnglish
          ? {
              recipeName: "Sườn Xào Chua Ngọt (Sweet and Sour Pork)",
              description: "A mouth-watering Vietnamese sweet and sour pork dish that is perfect with steam rice, utilizing your pantry essentials.",
              prepTime: "15 mins",
              cookTime: "25 mins",
              ingredientsUsedList: ingredients.map(i => `${i.name} (approx. 100g)`),
              additionalIngredientsNeeded: ["Fish sauce", "Sugar", "Garlic", "Shallots", "Vinegar"],
              steps: [
                "Cut ingredients and marinate with a pinch of salt and shallots.",
                "Mix fish sauce, sugar, vinegar, and water to make the sweet & sour sauce.",
                "Sauté garlic, add ingredients, pour the sauce, and simmer until glazed.",
                "Garnish with black pepper and serve hot."
              ],
              nutritionAlert: "High protein comfort food with delicious local caramelization."
            }
          : {
              recipeName: "Sườn Xào Chua Ngọt",
              description: "Món ăn mặn ngọt đậm đà, hao cơm, cực kỳ thích hợp để dùng kèm cơm nóng và tận dụng tối đa các nguyên liệu sắp hết hạn của bạn.",
              prepTime: "15 phút",
              cookTime: "25 phút",
              ingredientsUsedList: ingredients.map(i => `${i.name} (khoảng 100g)`),
              additionalIngredientsNeeded: ["Nước mắm", "Đường", "Tỏi", "Hành tím", "Giấm"],
              steps: [
                "Cắt nhỏ các nguyên liệu và ướp sơ với chút muối, hành băm.",
                "Pha nước sốt chua ngọt gồm nước mắm, đường, giấm và nước lọc.",
                "Phi thơm tỏi, cho nguyên liệu vào xào săn, rưới nước sốt lên om liu riu đến khi keo lại.",
                "Rắc thêm hạt tiêu và dùng nóng."
              ],
              nutritionAlert: "Món ăn giàu protein, kích thích vị giác và rất ấm bụng cho cả gia đình."
            };
        return res.json(fallbackObj);
      }

      const client = getGeminiClient();
      console.log("Calling Gemini API with model 'gemini-3.5-flash'...");

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recipeName: {
                type: Type.STRING,
                description: "Name of the Vietnamese recipe, in requested language.",
              },
              description: {
                type: Type.STRING,
                description: "A brief description of why this dish is delicious and uses the ingredients.",
              },
              prepTime: {
                type: Type.STRING,
                description: "Preparation duration (e.g. '15 mins' or '15 phút').",
              },
              cookTime: {
                type: Type.STRING,
                description: "Cooking duration (e.g. '20 mins' or '20 phút').",
              },
              ingredientsUsedList: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Ingredients list with quantities/descriptions that are used from the pantry.",
              },
              additionalIngredientsNeeded: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Common household ingredients/sauces that are likely needed (garlic, chili, fish sauce, etc.).",
              },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Step by step cooking process listed sequentially.",
              },
              nutritionAlert: {
                type: Type.STRING,
                description: "Quick wellness/nutrition advice for this combination.",
              },
            },
            required: [
              "recipeName",
              "description",
              "prepTime",
              "cookTime",
              "ingredientsUsedList",
              "additionalIngredientsNeeded",
              "steps",
              "nutritionAlert",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty text in Gemini response");
      }

      console.log("Successfully generated recipe from Gemini.");
      const parsedRecipe = JSON.parse(responseText.trim());
      res.json(parsedRecipe);
    } catch (err: any) {
      console.error("Gemini API Error details:", err);
      res.status(500).json({
        error: req.body.language === "vi"
          ? `Lỗi khi lấy đề xuất từ Gemini: ${err.message || err}`
          : `Error fetching suggestions from Gemini: ${err.message || err}`,
      });
    }
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server hosting on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
