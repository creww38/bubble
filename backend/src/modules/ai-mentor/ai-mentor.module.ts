import { Module } from '@nestjs/common';
import { AIMentorController } from './ai-mentor.controller';
import { AIMentorService } from './ai-mentor.service';
import { OpenAIService } from './services/openai.service';

@Module({
  controllers: [AIMentorController],
  providers: [AIMentorService, OpenAIService],
  exports: [AIMentorService, OpenAIService],
})
export class AIMentorModule {}