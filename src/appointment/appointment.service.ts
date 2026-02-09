<<<<<<< HEAD
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async bookAppointment(
    doctorId: string,
    patientId: string,
    appointmentData: any,
  ) {
    const appointment = this.appointmentRepo.create({
      doctorId,
      patientId,
      appointmentDate: new Date(appointmentData.appointmentDate),
      timeSlot: appointmentData.timeSlot,
      reason: appointmentData.reason || '',
      notes: appointmentData.notes || '',
      consultationFee: appointmentData.consultationFee || 0,
      status: AppointmentStatus.PENDING,
    });

    return await this.appointmentRepo.save(appointment);
  }

  async getAppointmentById(id: string) {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async getAppointmentsByDoctor(doctorId: string, status?: AppointmentStatus) {
    const query = this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.doctorId = :doctorId', { doctorId });

    if (status) {
      query.andWhere('appointment.status = :status', { status });
    }

    return await query.orderBy('appointment.appointmentDate', 'ASC').getMany();
  }

  async getAppointmentsByPatient(
    patientId: string,
    status?: AppointmentStatus,
  ) {
    const query = this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.patientId = :patientId', { patientId });

    if (status) {
      query.andWhere('appointment.status = :status', { status });
    }

    return await query.orderBy('appointment.appointmentDate', 'ASC').getMany();
  }

  async getAllAppointments(status?: AppointmentStatus) {
    const query = this.appointmentRepo.createQueryBuilder('appointment');

    if (status) {
      query.where('appointment.status = :status', { status });
    }

    return await query.orderBy('appointment.appointmentDate', 'DESC').getMany();
  }

  async updateAppointmentStatus(id: string, status: AppointmentStatus) {
    const appointment = await this.getAppointmentById(id);
    appointment.status = status;
    return await this.appointmentRepo.save(appointment);
  }

  async rescheduleAppointment(id: string, newDate: Date, newTimeSlot: string) {
    const appointment = await this.getAppointmentById(id);
    appointment.appointmentDate = newDate;
    appointment.timeSlot = newTimeSlot;
    appointment.status = AppointmentStatus.RESCHEDULED;
    return await this.appointmentRepo.save(appointment);
  }

  async cancelAppointment(id: string) {
    const appointment = await this.getAppointmentById(id);
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }
    appointment.status = AppointmentStatus.CANCELLED;
    return await this.appointmentRepo.save(appointment);
  }

  async confirmAppointment(id: string) {
    const appointment = await this.getAppointmentById(id);
    appointment.status = AppointmentStatus.CONFIRMED;
    return await this.appointmentRepo.save(appointment);
  }

  async completeAppointment(id: string, notes?: string) {
    const appointment = await this.getAppointmentById(id);
    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException(
        'Only confirmed appointments can be completed',
      );
    }
    appointment.status = AppointmentStatus.COMPLETED;
    if (notes) {
      appointment.notes = notes;
    }
    return await this.appointmentRepo.save(appointment);
  }

  async deleteAppointment(id: string) {
    const appointment = await this.getAppointmentById(id);
    await this.appointmentRepo.remove(appointment);
    return { message: 'Appointment deleted successfully' };
  }

  async checkTimeSlotAvailability(
    doctorId: string,
    appointmentDate: Date,
    timeSlot: string,
  ) {
    const existing = await this.appointmentRepo.findOne({
      where: {
        doctorId,
        appointmentDate,
        timeSlot,
        status: AppointmentStatus.CONFIRMED,
      },
    });
    return !existing;
  }
}
=======
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppointmentService {}
>>>>>>> b4fd880e5ed4e4cd4c828c631d096722ea3734bb
