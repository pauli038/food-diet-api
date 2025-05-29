// src/gemini/gemini.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeminiService } from './gemini.service';

@Module({
  imports: [HttpModule],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
