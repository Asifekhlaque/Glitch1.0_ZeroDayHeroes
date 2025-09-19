"use server";

import {
  generateDietPlan,
  type GenerateDietPlanInput,
} from "@/ai/flows/generate-diet-plan";
import {
  generateWorkoutPlan,
  type GenerateWorkoutPlanInput,
} from "@/ai/flows/generate-workout-plan";
import {
  assessMentalHealth,
  type AssessMentalHealthInput,
} from "@/ai/flows/assess-mental-health";

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

/**
 * Server action to assess mental health based on user input.
 * @param input - The user's description of their feelings.
 * @returns The AI's analysis of their mental state.
 */
export async function getMentalHealthAssessment(input: AssessMentalHealthInput) {
  const result = await assessMentalHealth(input);
  return result;
}
