import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentService } from './appointment.service';
import { AppointmentStatus } from './appointment.entity';
import { BookAppointmentDto } from '../common/dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Post('book')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async bookAppointment(
    @Request() req: any,
    @Body() bookAppointmentDto: BookAppointmentDto,
  ) {
    const appointment = await this.appointmentService.bookAppointment(
      bookAppointmentDto.doctorId,
      req.user.userId,
      bookAppointmentDto,
    );
    return {
      statusCode: 201,
      message: 'Appointment booked successfully',
      data: appointment,
    };
  }

  @Get(':id')
  async getAppointmentById(@Param('id') id: string) {
    const appointment = await this.appointmentService.getAppointmentById(id);
    return {
      statusCode: 200,
      data: appointment,
    };
  }

  @Get('doctor/:doctorId')
  async getDoctorAppointments(
    @Param('doctorId') doctorId: string,
    @Query('status') status?: AppointmentStatus,
  ) {
    const appointments = await this.appointmentService.getAppointmentsByDoctor(
      doctorId,
      status,
    );
    return {
      statusCode: 200,
      data: appointments,
      total: appointments.length,
    };
  }

  @Get('patient/:patientId')
  async getPatientAppointments(
    @Param('patientId') patientId: string,
    @Query('status') status?: AppointmentStatus,
  ) {
    const appointments = await this.appointmentService.getAppointmentsByPatient(
      patientId,
      status,
    );
    return {
      statusCode: 200,
      data: appointments,
      total: appointments.length,
    };
  }

  @Get()
  async getAllAppointments(@Query('status') status?: AppointmentStatus) {
    const appointments =
      await this.appointmentService.getAllAppointments(status);
    return {
      statusCode: 200,
      data: appointments,
      total: appointments.length,
    };
  }

  @Put(':id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateAppointmentStatus(
    @Param('id') id: string,
    @Body() statusDto: any,
  ) {
    const appointment = await this.appointmentService.updateAppointmentStatus(
      id,
      statusDto.status,
    );
    return {
      statusCode: 200,
      message: 'Appointment status updated',
      data: appointment,
    };
  }

  @Put(':id/reschedule')
  @UseGuards(AuthGuard('jwt'))
  async rescheduleAppointment(
    @Param('id') id: string,
    @Body() rescheduleDto: any,
  ) {
    const appointment = await this.appointmentService.rescheduleAppointment(
      id,
      new Date(rescheduleDto.newDate),
      rescheduleDto.newTimeSlot,
    );
    return {
      statusCode: 200,
      message: 'Appointment rescheduled successfully',
      data: appointment,
    };
  }

  @Put(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  async cancelAppointment(@Param('id') id: string) {
    const appointment = await this.appointmentService.cancelAppointment(id);
    return {
      statusCode: 200,
      message: 'Appointment cancelled successfully',
      data: appointment,
    };
  }

  @Put(':id/confirm')
  @UseGuards(AuthGuard('jwt'))
  async confirmAppointment(@Param('id') id: string) {
    const appointment = await this.appointmentService.confirmAppointment(id);
    return {
      statusCode: 200,
      message: 'Appointment confirmed successfully',
      data: appointment,
    };
  }

  @Put(':id/complete')
  @UseGuards(AuthGuard('jwt'))
  async completeAppointment(
    @Param('id') id: string,
    @Body() completeDto?: any,
  ) {
    const appointment = await this.appointmentService.completeAppointment(
      id,
      completeDto?.notes,
    );
    return {
      statusCode: 200,
      message: 'Appointment completed successfully',
      data: appointment,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deleteAppointment(@Param('id') id: string) {
    await this.appointmentService.deleteAppointment(id);
    return {
      statusCode: 200,
      message: 'Appointment deleted successfully',
    };
  }

  @Get('check-availability/:doctorId')
  async checkTimeSlotAvailability(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
    @Query('timeSlot') timeSlot: string,
  ) {
    const isAvailable = await this.appointmentService.checkTimeSlotAvailability(
      doctorId,
      new Date(date),
      timeSlot,
    );
    return {
      statusCode: 200,
      data: { isAvailable },
    };
  }
}
