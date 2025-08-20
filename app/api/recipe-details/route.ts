import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const { recipe } = await request.json()

    console.log("[v0] Generating full recipe details for:", recipe.name)

    const prompt = `Generate detailed cooking instructions and ingredients list for this recipe:

Recipe Name: ${recipe.name}
Description: ${recipe.description}
Macros: ${recipe.macros.protein_g}g protein, ${recipe.macros.carbs_g}g carbs, ${recipe.macros.fat_g}g fat

Please provide a complete recipe with:
1. A detailed ingredients list with quantities
2. Step-by-step cooking instructions
3. Calculate the total calories for this recipe
4. Specify how many servings this recipe makes

Return the response as a JSON object with this exact structure:
{
  "name": "${recipe.name}",
  "description": "${recipe.description}",
  "macros": {
    "protein_g": ${recipe.macros.protein_g},
    "carbs_g": ${recipe.macros.carbs_g},
    "fat_g": ${recipe.macros.fat_g}
  },
  "calories_kcal": [calculated total calories],
  "servings": [number of servings this recipe makes],
  "ingredients": [
    {"name": "ingredient name", "quantity": "amount and unit"}
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ]
}

Make sure the ingredients and instructions are realistic and will achieve the specified macronutrient targets. Calculate calories using: (protein_g × 4) + (carbs_g × 4) + (fat_g × 9). Specify a reasonable number of servings (typically 1-4) based on the recipe type and portion sizes.`

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.7,
    })

    console.log("[v0] Raw recipe details response:", text)

    // Parse the JSON response
    let fullRecipe
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        fullRecipe = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("[v0] Failed to parse recipe details JSON:", parseError)
      throw new Error("Failed to parse recipe details")
    }

    console.log("[v0] Successfully parsed full recipe:", fullRecipe)

    return Response.json(fullRecipe)
  } catch (error) {
    console.error("Recipe details generation error:", error)
    return Response.json({ error: "Failed to generate recipe details" }, { status: 500 })
  }
}
