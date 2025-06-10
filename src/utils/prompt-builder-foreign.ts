import { Profile } from 'src/profile/profile.model';

export function buildForeignRecipePrompt(
  profile: Profile,
  country: string,
): string {
  const preferences =
    typeof profile.preferences === 'string'
      ? JSON.parse(profile.preferences)
      : profile.preferences;

  const conditions =
    typeof profile.conditions === 'string'
      ? JSON.parse(profile.conditions)
      : profile.conditions;

  const fecha = new Date().toLocaleDateString('es-ES');

  return `Quiero que generes una receta saludable y original en formato JSON válido, sin explicaciones ni justificaciones. Cada vez que generes una receta, intenta variar el tipo de comida, nivel de dificultad, ingredientes y estilo culinario (puede ser desayuno, cena, snack, internacional, vegetal, rápida, etc.). La receta debe estar basada exclusivamente en la gastronomía de ${country}.

Usa la siguiente estructura **estrictamente**:

{
  "name": "Nombre de la receta",
  "country": "País de origen(Tailandia, Japón, México, Francia o Italia)",
  "category": "Categoría de la receta (desayuno, cena, almuerzo, merienda)",
  "description": "Descripción breve de la receta",
  "imageUrl": "URL ilustrativa obtenida desde https://foodish-api.com. No es obligatorio que coincida exactamente con el plato, pero debe ser lo más representativa posible del tipo de comida (por ejemplo, si la receta es una sopa, muestra una imagen de una sopa cualquiera)."
  "ingredients": ["Ingrediente 1", "Ingrediente 2", "..."],
  "steps": ["Paso 1", "Paso 2", "..."]
}

🧍 Datos del usuario:
- Edad: ${profile.age}
- Altura: ${profile.height} cm
- Peso: ${profile.weight} kg
- Objetivo: ${profile.objective || 'general'}

✅ Preferencias alimentarias: ${Array.isArray(preferences) && preferences.length ? preferences.join(', ') : 'ninguna'}
🚫 Condiciones médicas: ${Array.isArray(conditions) && conditions.length ? conditions.map((c) => c.condition || c).join(', ') : 'ninguna'}

📅 Fecha de generación: ${fecha}

⚠️ IMPORTANTE:
- Responde **solo** con un objeto JSON válido.
- No incluyas explicaciones, comentarios, ni texto adicional.`;
}
