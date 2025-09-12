"use server";

import {
  generateDietPlan,
  type GenerateDietPlanInput,
} from "@/ai/flows/generate-diet-plan";
import {
  generateWorkoutPlan,
  type GenerateWorkoutPlanInput,
} from "@/ai/flows/generate-workout-plan";

/**
 * Server action to generate a personalized diet plan.
 * In a real-world application, you would also save this to Firestore.
 * @param input - The user's details for plan generation.
 * @returns The generated diet plan.
 */
export async function getDietPlan(input: GenerateDietPlanInput) {
  const result = await generateDietPlan(input);
  return result;
}

/**
 * Server action to generate a personalized workout plan.
 * In a real-world application, you would also save this to Firestore.
 * @param input - The user's fitness profile for plan generation.
 * @returns The generated workout plan.
 */
export async function getWorkoutPlan(input: GenerateWorkoutPlanInput) {
  const result = await generateWorkoutPlan(input);
  return result;
}
