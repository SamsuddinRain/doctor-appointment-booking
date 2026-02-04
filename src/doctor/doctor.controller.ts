import { Controller, Get } from '@nestjs/common';

@Controller('doctor')
export class DoctorController {

  @Get('hello')
  helloDoctor() {
    return {
      message: 'Hello, I am Doctor. Ready for appointments 👨‍⚕️'
    };
  }
}
