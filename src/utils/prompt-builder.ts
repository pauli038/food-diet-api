import { Profile } from '../profile/profile.model';

export function buildRecipePrompt(profile: Profile): string {
  // Parsear si vienen como string
  const preferences = typeof profile.preferences === 'string'
    ? JSON.parse(profile.preferences)
    : profile.preferences;

  const conditions = typeof profile.conditions === 'string'
    ? JSON.parse(profile.conditions)
    : profile.conditions;

  const base = `Genera una receta saludable en formato JSON con los siguientes campos:
{
  "name": "Nombre de la receta",
  "description": "Descripción corta de la receta",
  "ingredients": ["Ingrediente 1", "Ingrediente 2", "..."],
  "steps": ["Paso 1", "Paso 2", "..."]
}`;

  const objetivo = `Objetivo: ${profile.objective}`;
  const datos = `Edad: ${profile.age} años, Altura: ${profile.height} cm, Peso: ${profile.weight} kg.`;

  const preferenciasText = Array.isArray(preferences) && preferences.length
    ? `Preferencias: ${preferences.join(', ')}.`
    : 'Preferencias: ninguna.';

  const condicionesText = Array.isArray(conditions) && conditions.length
    ? `Condiciones de salud:\n${conditions.map((c) => `- ${c.condition || c}`).join('\n')}`
    : 'Condiciones médicas: ninguna.';

  return `${base}\n\n${datos}\n${objetivo}\n${preferenciasText}\n${condicionesText}\nLa receta debe ser sencilla y adecuada para este perfil.`;
}

