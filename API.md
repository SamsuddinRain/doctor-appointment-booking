# Doctor Appointment Booking System API

A comprehensive NestJS backend API for managing doctor-patient appointments with authentication, profile management, and appointment scheduling.

## Features Implemented

### ✅ Authentication
- **Google OAuth 2.0 Integration** - Sign in/Sign up with Google
- **JWT Token-based Authentication** - Secure API endpoints with JWT
- **User Roles** - Patient and Doctor role management
- **Profile Management** - Get current user profile with `/auth/me`

### ✅ Doctor Experience
- **Doctor Profile Creation** - Create and manage doctor profiles with specialization, licenses, bio
- **Doctor Search** - Search doctors by specialization
- **Doctor Availability Management** - Set doctor status (available/unavailable/on_leave)
- **Doctor Rating & Reviews** - Track doctor ratings and appointment counts
- **Complete CRUD Operations** - Full control over doctor profiles

### ✅ Patient Experience
- **Patient Profile Management** - Create and manage patient profiles with health information
- **Medical History Tracking** - Store allergies, blood type, medical history
- **Patient Records** - Appointment history and status tracking

### ✅ Appointment Management
- **Book Appointments** - Patients can book appointments with doctors
- **Appointment Status Management** - Track appointment lifecycle (pending, confirmed, completed, cancelled)
- **Reschedule Appointments** - Modify appointment dates and times
- **Time Slot Availability** - Check doctor's available time slots
- **Consultation Fees** - Store and manage consultation costs

## API Endpoints

### Authentication Endpoints

```
POST /auth/signup          - Register a new user
POST /auth/signin          - Sign in with email
GET  /auth/google          - Initiate Google OAuth flow
GET  /auth/google/callback - Google OAuth callback
GET  /auth/me             - Get current user profile (Requires JWT)
```

### Doctor Endpoints

```
POST /doctor/profile           - Create doctor profile (Requires JWT)
GET  /doctor/profile           - Get current doctor profile (Requires JWT)
GET  /doctor/:id              - Get doctor by ID
GET  /doctor                  - Get all available doctors
GET  /doctor/search/:query    - Search doctors by specialization/bio
PUT  /doctor/profile          - Update doctor profile (Requires JWT)
PUT  /doctor/status           - Update availability status (Requires JWT)
DELETE /doctor/profile        - Delete doctor profile (Requires JWT)
```

### Patient Endpoints

```
POST /patient/profile    - Create patient profile (Requires JWT)
GET  /patient/profile    - Get current patient profile (Requires JWT)
GET  /patient/:id       - Get patient by ID
GET  /patient           - Get all patients
PUT  /patient/profile   - Update patient profile (Requires JWT)
DELETE /patient/profile - Delete patient profile (Requires JWT)
```

### Appointment Endpoints

```
POST /appointment/book                           - Book an appointment (Requires JWT)
GET  /appointment/:id                           - Get appointment details
GET  /appointment                               - Get all appointments (with optional status filter)
GET  /appointment/doctor/:doctorId              - Get doctor's appointments (with optional status filter)
GET  /appointment/patient/:patientId            - Get patient's appointments (with optional status filter)
GET  /appointment/check-availability/:doctorId  - Check if time slot is available
PUT  /appointment/:id/status                    - Update appointment status (Requires JWT)
PUT  /appointment/:id/reschedule                - Reschedule appointment (Requires JWT)
PUT  /appointment/:id/confirm                   - Confirm appointment (Requires JWT)
PUT  /appointment/:id/complete                  - Mark appointment as completed (Requires JWT)
PUT  /appointment/:id/cancel                    - Cancel appointment (Requires JWT)
DELETE /appointment/:id                         - Delete appointment (Requires JWT)
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=doctor_appointment
   
   JWT_SECRET=your-secret-key
   
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   
   PORT=3000
   NODE_ENV=development
   ```

3. **Create Database**
   ```sql
   CREATE DATABASE doctor_appointment;
   ```

4. **Start Development Server**
   ```bash
   npm run start:dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm run start:prod
   ```

## Request/Response Format

### Successful Response (200-201)
```json
{
  "statusCode": 200,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response (4xx-5xx)
```json
{
  "statusCode": 400,
  "message": "Error description"
}
```

## Example Requests

### Sign Up
```json
POST /auth/signup
{
  "email": "doctor@example.com",
  "name": "Dr. John",
  "role": "doctor"
}
```

### Create Doctor Profile (Requires JWT Token)
```json
POST /auth/profile
Headers: Authorization: Bearer <jwt_token>
{
  "specialization": "Cardiology",
  "bio": "Experienced cardiologist",
  "license": "MED123456",
  "phone": "9876543210",
  "address": "123 Medical Center Ave",
  "consultationFee": 500
}
```

### Book Appointment (Requires JWT Token)
```json
POST /appointment/book
Headers: Authorization: Bearer <jwt_token>
{
  "doctorId": "doctor-uuid",
  "appointmentDate": "2026-02-20",
  "timeSlot": "10:00 AM",
  "reason": "Regular checkup",
  "notes": "Any specific concerns"
}
```

## Technology Stack

- **Framework:** NestJS 11
- **Database:** PostgreSQL with TypeORM
- **Authentication:** Passport.js with JWT & Google OAuth
- **Validation:** Class Validators
- **API Documentation:** Swagger/OpenAPI (can be added)

## Database Schema

### Users Table
- id (UUID)
- email (string)
- name (string)
- googleId (string)
- photo (string)
- role (enum: patient, doctor)

### Doctors Table
- id (UUID)
- userId (UUID, FK)
- specialization (string)
- bio (text)
- license (string)
- phone (string)
- address (text)
- rating (decimal)
- status (enum: available, unavailable, on_leave)
- totalAppointments (integer)
- consultationFee (decimal)

### Patients Table
- id (UUID)
- userId (UUID, FK)
- phone (string)
- address (text)
- bloodType (string)
- medicalHistory (text)
- allergies (text)
- totalAppointments (integer)

### Appointments Table
- id (UUID)
- doctorId (UUID, FK)
- patientId (UUID, FK)
- appointmentDate (timestamp)
- timeSlot (string)
- status (enum: pending, confirmed, completed, cancelled, rescheduled)
- reason (text)
- notes (text)
- consultationFee (decimal)
- meetingLink (string)

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

## Linting & Formatting

```bash
# Run ESLint with auto-fix
npm run lint

# Format code with Prettier
npm run format
```

## Future Enhancements

- [ ] Appointment notifications (Email/SMS)
- [ ] Video consultation integration
- [ ] Payment gateway integration
- [ ] Reviews and ratings system
- [ ] Prescription management
- [ ] Medical records storage
- [ ] Analytics dashboard
- [ ] Automated appointment reminders
- [ ] Multi-language support

## Known Issues & Limitations

1. No password-based authentication (Google OAuth only for now)
2. No file uploads for documents
3. No real-time notification system yet
4. No payment processing integration

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure linting passes (`npm run lint`)
4. Submit a pull request

## License

UNLICENSED

## Support

For issues and questions, please create an issue in the repository.
