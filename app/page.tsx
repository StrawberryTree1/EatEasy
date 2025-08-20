"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Recipe {
  name: string
  description: string
  macros: {
    protein_g: number
    carbs_g: number
    fat_g: number
  }
  calories_kcal?: number
  servings?: number
  ingredients: Array<{
    name: string
    quantity: string
  }>
  instructions: string[]
}

export default function RecipePage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    try {
      const storedRecipe = sessionStorage.getItem("selectedRecipe")
      if (storedRecipe) {
        const parsedRecipe = JSON.parse(storedRecipe)
        setRecipe(parsedRecipe)
      } else {
        setError("No recipe data found. Please select a recipe from the main page.")
      }
    } catch (err) {
      setError("Failed to load recipe data. Please try again.")
      console.error("Error loading recipe:", err)
    }
  }, [])

  const handleBackToHome = () => {
    router.push("/")
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl min-h-screen bg-background">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-foreground mb-6 font-sans">Recipe Not Found</h1>
          <p className="text-muted-foreground mb-8 font-sans text-lg">{error}</p>
          <Button onClick={handleBackToHome} className="bg-primary hover:bg-primary/90 font-sans">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container mx-auto p-6 max-w-4xl min-h-screen bg-background">
        <div className="text-center py-16">
          <p className="text-muted-foreground font-sans text-lg">Loading recipe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl min-h-screen bg-background">
      <div className="mb-8">
        <Button
          onClick={handleBackToHome}
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-foreground font-sans hover:bg-secondary/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Recipes
        </Button>

        <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight font-sans">{recipe.name}</h1>
        <p className="text-xl text-muted-foreground mb-6 leading-relaxed font-sans">{recipe.description}</p>

        {recipe.servings && (
          <p className="text-lg text-muted-foreground mb-8 font-medium font-sans">
            Serves {recipe.servings} {recipe.servings === 1 ? "person" : "people"}
          </p>
        )}

        <div className="mb-10">
          <div className="bg-secondary/30 rounded-xl px-8 py-4 border border-border/50 card-shadow">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-lg font-bold text-secondary-foreground font-sans mr-6">Nutritional Information</h3>
              <div className="flex items-center gap-8">
                {recipe.calories_kcal && (
                  <div className="text-center">
                    <div className="text-xl font-bold text-accent font-sans">{recipe.calories_kcal}</div>
                    <div className="text-xs text-muted-foreground font-sans">Calories</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-xl font-bold text-accent font-sans">{recipe.macros.protein_g}g</div>
                  <div className="text-xs text-muted-foreground font-sans">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-accent font-sans">{recipe.macros.carbs_g}g</div>
                  <div className="text-xs text-muted-foreground font-sans">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-accent font-sans">{recipe.macros.fat_g}g</div>
                  <div className="text-xs text-muted-foreground font-sans">Fat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <Card className="card-shadow border-border bg-card rounded-xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border/50">
            <CardTitle className="text-3xl font-bold text-card-foreground font-sans">Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <ul className="space-y-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex justify-between items-start py-2 border-b border-border/30 last:border-b-0"
                >
                  <span className="text-card-foreground font-medium font-sans text-lg">{ingredient.name}</span>
                  <span className="text-muted-foreground ml-6 text-right font-sans">{ingredient.quantity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="card-shadow border-border bg-card rounded-xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border/50">
            <CardTitle className="text-3xl font-bold text-card-foreground font-sans">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <ol className="space-y-6">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-6 mt-1 flex-shrink-0 font-sans">
                    {index + 1}
                  </span>
                  <span className="text-card-foreground leading-relaxed font-sans text-lg">{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
