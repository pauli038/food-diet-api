import { Profile } from '../profile/profile.model';

export function buildRecipePrompt(profile: Profile,category: string): string {
  const preferences = typeof profile.preferences === 'string'
    ? JSON.parse(profile.preferences)
    : profile.preferences;

  const conditions = typeof profile.conditions === 'string'
    ? JSON.parse(profile.conditions)
    : profile.conditions;

  const fecha = new Date().toLocaleDateString('es-ES');
  const allowedCategories = ['desayuno', 'almuerzo', 'cena', 'merienda'];

  const base = `Quiero que generes una receta saludable y original en formato JSON válido, sin explicaciones ni justificaciones. 
Debes usar la categoría de comida proporcionada: **${category}**.


Usa la siguiente estructura **estrictamente**:

{
  "name": "Nombre de la receta",
  "description": "Descripción breve de la receta",
  "ingredients": ["Ingrediente 1", "Ingrediente 2", "..."],
  "category": Una categoría de comida seleccionada de entre ${allowedCategories.join(', ')},
  "steps": ["Paso 1", "Paso 2", "..."]
}

🧍 Datos del usuario:
- Edad: ${profile.age}
- Altura: ${profile.height} cm
- Peso: ${profile.weight} kg
- Objetivo: ${profile.objective || 'general'}

✅ Preferencias alimentarias: ${Array.isArray(preferences) && preferences.length ? preferences.join(', ') : 'ninguna'}
🚫 Condiciones médicas: ${Array.isArray(conditions) && conditions.length ? conditions.map(c => c.condition || c).join(', ') : 'ninguna'}

📅 Fecha de generación: ${fecha}

⚠️ IMPORTANTE:
- Responde **solo** con un objeto JSON válido.
- No incluyas explicaciones, comentarios, ni texto adicional.
`;

  return base;
}

