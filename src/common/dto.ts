export class SignUpDto {
  email: string;
  name: string;
  role: 'doctor' | 'patient';
}

export class SignInDto {
  email: string;
}

export class CreateDoctorProfileDto {
  specialization: string;
  bio?: string;
  license?: string;
  phone?: string;
  address?: string;
  consultationFee?: number;
}

export class UpdateDoctorProfileDto {
  specialization?: string;
  bio?: string;
  license?: string;
  phone?: string;
  address?: string;
  consultationFee?: number;
  status?: 'available' | 'unavailable' | 'on_leave';
}

export class CreatePatientProfileDto {
  phone?: string;
  address?: string;
  bloodType?: string;
  medicalHistory?: string;
  allergies?: string;
}

export class UpdatePatientProfileDto {
  phone?: string;
  address?: string;
  bloodType?: string;
  medicalHistory?: string;
  allergies?: string;
}

export class BookAppointmentDto {
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
  reason?: string;
  notes?: string;
  consultationFee?: number;
}
