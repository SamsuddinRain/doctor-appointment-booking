import { Controller, Post, Body } from '@nestjs/common';

@Controller('appointment')
export class AppointmentController {

  @Post('book')
  bookAppointment(@Body() body: any) {
    return {
      doctorId: body.doctorId,
      patientId: body.patientId,
      date: body.date,
      status: 'PENDING',
      message: 'Appointment booked successfully ✅'
    };
  }
}
