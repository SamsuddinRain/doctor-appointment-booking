import { Controller, Get } from '@nestjs/common';

@Controller('patient')
export class PatientController {

  @Get('hello')
  helloPatient() {
    return {
      message: 'Hello Doctor, I want to book an appointment 🧑'
    };
  }
}
