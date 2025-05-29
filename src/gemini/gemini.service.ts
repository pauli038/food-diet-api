import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeminiService {
  private readonly apiKey = process.env.GEMINI_API_KEY;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(private readonly httpService: HttpService) {}

  async generateContent(prompt: string): Promise<string> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          this.apiUrl,
          { contents: [{ parts: [{ text: prompt }] }] },
          {
            params: { key: this.apiKey },
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );

      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    } catch (error) {
      console.error('Error al consultar Gemini:', error?.response?.data || error);
      throw new InternalServerErrorException('Error al generar receta con IA');
    }
  }
}
