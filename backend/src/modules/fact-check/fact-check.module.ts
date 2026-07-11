import { Module } from '@nestjs/common';
import { FactCheckController } from './fact-check.controller';
import { FactCheckService } from './fact-check.service';

@Module({
  controllers: [FactCheckController],
  providers: [FactCheckService],
  exports: [FactCheckService],
})
export class FactCheckModule {}