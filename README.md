# doctor-appointment-booking
Doctor Appointment Booking backend using NestJS and TypeScript

## 📊 ER Diagram

🔗 **ER Diagram Link:**  
[Doctor Appointment Booking ER Diagram](docs/er-diagram.png)




# Doctor Appointment Booking API

## Tech Stack
- TypeScript
- NestJS
- Node.js

## Modules
- Doctor
- Patient
- Appointment

## APIs

### Doctor Hello
GET /doctor/hello

### Patient Hello
GET /patient/hello

### Book Appointment
POST /appointment/book

### Sample Request
```json
{
  "doctorId": 1,
  "patientId": 101,
  "date": "2026-02-10"
}
