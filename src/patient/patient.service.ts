<<<<<<< HEAD
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
  ) {}

  async createPatientProfile(userId: string, patientData: any) {
    const existingPatient = await this.patientRepo.findOne({
      where: { userId },
    });
    if (existingPatient) {
      throw new BadRequestException('Patient profile already exists');
    }

    const patient = this.patientRepo.create({
      userId,
      phone: patientData.phone || '',
      address: patientData.address || '',
      bloodType: patientData.bloodType || '',
      medicalHistory: patientData.medicalHistory || '',
      allergies: patientData.allergies || '',
    });

    return await this.patientRepo.save(patient);
  }

  async getPatientById(id: string) {
    const patient = await this.patientRepo.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async getPatientByUserId(userId: string) {
    const patient = await this.patientRepo.findOne({ where: { userId } });
    if (!patient) {
      throw new NotFoundException(
        `Patient profile not found for user ${userId}`,
      );
    }
    return patient;
  }

  async getAllPatients() {
    return await this.patientRepo.find();
  }

  async updatePatientProfile(userId: string, updateData: any) {
    const patient = await this.getPatientByUserId(userId);

    Object.assign(patient, {
      phone: updateData.phone !== undefined ? updateData.phone : patient.phone,
      address:
        updateData.address !== undefined ? updateData.address : patient.address,
      bloodType:
        updateData.bloodType !== undefined
          ? updateData.bloodType
          : patient.bloodType,
      medicalHistory:
        updateData.medicalHistory !== undefined
          ? updateData.medicalHistory
          : patient.medicalHistory,
      allergies:
        updateData.allergies !== undefined
          ? updateData.allergies
          : patient.allergies,
    });

    return await this.patientRepo.save(patient);
  }

  async deletePatientProfile(userId: string) {
    const patient = await this.getPatientByUserId(userId);
    await this.patientRepo.remove(patient);
    return { message: 'Patient profile deleted successfully' };
  }

  async incrementAppointmentCount(userId: string) {
    const patient = await this.getPatientByUserId(userId);
    patient.totalAppointments += 1;
    return await this.patientRepo.save(patient);
  }
}
=======
import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientService {}
>>>>>>> b4fd880e5ed4e4cd4c828c631d096722ea3734bb
