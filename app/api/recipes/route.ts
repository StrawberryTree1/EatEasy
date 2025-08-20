import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const { craving } = await request.json()

    if (!craving) {
      return Response.json({ error: "Craving is required" }, { status: 400 })
    }

    const prompt = `You are a culinary expert and a health-conscious AI. Your task is to generate three distinct and appealing recipe ideas based on a user's craving.

The response must be a single JSON object. Do not include any other text, markdown formatting (like \`\`\`json), or conversational filler. The JSON must contain a single key, recipes, which is an array of three objects.

Each object in the recipes array must have the following keys and data types:
* name: A string for the recipe's name.
* description: A brief string (1-2 sentences) describing the dish and its flavor profile.
* macros: An object containing the estimated macronutrient breakdown. This object must have three number keys:
    * protein_g: A number for estimated grams of protein.
    * carbs_g: A number for estimated grams of carbohydrates.
    * fat_g: A number for estimated grams of fat.

Your response should be based on the following user craving: ${craving}`

    console.log(`[v0] Generating recipes with Groq for craving: ${craving}`)

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
    })

    console.log(`[v0] Raw response from Groq:`, text)

    try {
      const recipes = JSON.parse(text.trim())
      console.log(`[v0] Successfully parsed recipes:`, recipes)
      return Response.json(recipes)
    } catch (parseError) {
      console.error(`[v0] Failed to parse JSON response:`, parseError)
      console.error(`[v0] Raw text was:`, text)
      return Response.json(
        {
          error: "Failed to parse recipe response",
          details: "The AI response was not valid JSON",
          rawResponse: text,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Recipe generation error:", error)
    return Response.json(
      {
        error: "Failed to generate recipes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
