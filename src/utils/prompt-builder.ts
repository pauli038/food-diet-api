import { Profile } from '../profile/profile.model';

export function buildRecipePrompt(profile: Profile): string {
  const base = `Genera una receta saludable en formato JSON con los siguientes campos:
{
  "name": "Nombre de la receta",
  "description": "Descripción corta de la receta",
  "ingredients": ["Ingrediente 1", "Ingrediente 2", "..."],
  "steps": ["Paso 1", "Paso 2", "..."]
}`;

  const objetivo = `Objetivo: ${profile.objective}`;
  const datos = `Edad: ${profile.age} años, Altura: ${profile.height} cm, Peso: ${profile.weight} kg.`;

  const preferencias = Array.isArray(profile.preferences) && profile.preferences.length
    ? `Preferencias: ${profile.preferences.join(', ')}.`
    : '';

  const condiciones = Array.isArray(profile.conditions) && profile.conditions.length
    ? `Condiciones de salud:\n${profile.conditions
        .map((c) => `- ${c.condition}: ${c.notes}`)
        .join('\n')}`
    : '';

  return `${base}\n\n${datos}\n${objetivo}\n${preferencias}\n${condiciones}\nLa receta debe ser sencilla y adecuada para este perfil.`;
}
