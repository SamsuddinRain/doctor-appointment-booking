<<<<<<< HEAD
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
  ) {}

  async createDoctorProfile(userId: string, doctorData: any) {
    const existingDoctor = await this.doctorRepo.findOne({ where: { userId } });
    if (existingDoctor) {
      throw new BadRequestException('Doctor profile already exists');
    }

    const doctor = this.doctorRepo.create({
      userId,
      specialization: doctorData.specialization,
      bio: doctorData.bio || '',
      license: doctorData.license || '',
      phone: doctorData.phone || '',
      address: doctorData.address || '',
      consultationFee: doctorData.consultationFee || 0,
      status: 'available',
    });

    return await this.doctorRepo.save(doctor);
  }

  async getDoctorById(id: string) {
    const doctor = await this.doctorRepo.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async getDoctorByUserId(userId: string) {
    const doctor = await this.doctorRepo.findOne({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException(
        `Doctor profile not found for user ${userId}`,
      );
    }
    return doctor;
  }

  async getAllDoctors(specialization?: string) {
    const query = this.doctorRepo.createQueryBuilder('doctor');

    if (specialization) {
      query.where('doctor.specialization = :specialization', {
        specialization,
      });
    }

    query.where('doctor.status = :status', { status: 'available' });
    return await query.getMany();
  }

  async updateDoctorProfile(userId: string, updateData: any) {
    const doctor = await this.getDoctorByUserId(userId);

    Object.assign(doctor, {
      specialization: updateData.specialization || doctor.specialization,
      bio: updateData.bio !== undefined ? updateData.bio : doctor.bio,
      license:
        updateData.license !== undefined ? updateData.license : doctor.license,
      phone: updateData.phone !== undefined ? updateData.phone : doctor.phone,
      address:
        updateData.address !== undefined ? updateData.address : doctor.address,
      consultationFee:
        updateData.consultationFee !== undefined
          ? updateData.consultationFee
          : doctor.consultationFee,
      status: updateData.status || doctor.status,
    });

    return await this.doctorRepo.save(doctor);
  }

  async updateDoctorStatus(
    userId: string,
    status: 'available' | 'unavailable' | 'on_leave',
  ) {
    const doctor = await this.getDoctorByUserId(userId);
    doctor.status = status;
    return await this.doctorRepo.save(doctor);
  }

  async deleteDoctorProfile(userId: string) {
    const doctor = await this.getDoctorByUserId(userId);
    await this.doctorRepo.remove(doctor);
    return { message: 'Doctor profile deleted successfully' };
  }

  async incrementAppointmentCount(userId: string) {
    const doctor = await this.getDoctorByUserId(userId);
    doctor.totalAppointments += 1;
    return await this.doctorRepo.save(doctor);
  }

  async updateDoctorRating(userId: string, rating: number) {
    const doctor = await this.getDoctorByUserId(userId);
    if (rating < 0 || rating > 5) {
      throw new BadRequestException('Rating must be between 0 and 5');
    }
    doctor.rating = rating;
    return await this.doctorRepo.save(doctor);
  }

  async searchDoctors(query: string) {
    return await this.doctorRepo
      .createQueryBuilder('doctor')
      .where('doctor.specialization ILIKE :query', { query: `%${query}%` })
      .orWhere('doctor.bio ILIKE :query', { query: `%${query}%` })
      .andWhere('doctor.status = :status', { status: 'available' })
      .getMany();
  }
}
=======
import { Injectable } from '@nestjs/common';

@Injectable()
export class DoctorService {}
>>>>>>> b4fd880e5ed4e4cd4c828c631d096722ea3734bb
