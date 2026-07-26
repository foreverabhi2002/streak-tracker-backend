import { PartialType } from '@nestjs/swagger';
import { CreateLogEntryDto } from './create-log-entry.dto';

export class UpdateLogEntryDto extends PartialType(CreateLogEntryDto) {}
