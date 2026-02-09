import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { User } from './auth/user.entity';
import { Doctor } from './doctor/doctor.entity';
import { Patient } from './patient/patient.entity';
import { Appointment } from './appointment/appointment.entity';

@Module({
<<<<<<< HEAD
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'doctor_appointment.db',
      entities: [User, Doctor, Patient, Appointment],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    DoctorModule,
    PatientModule,
    AppointmentModule,
  ],
=======
  imports: [AuthModule],
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [DoctorModule, PatientModule, AppointmentModule],
  controllers: [AppController],
  providers: [AppService],
>>>>>>> b4fd880e5ed4e4cd4c828c631d096722ea3734bb
})
export class AppModule {}
