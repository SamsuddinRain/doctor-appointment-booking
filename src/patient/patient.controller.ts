import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PatientService } from './patient.service';
import {
  CreatePatientProfileDto,
  UpdatePatientProfileDto,
} from '../common/dto';

@Controller('patient')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Post('profile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @Request() req: any,
    @Body() createPatientDto: CreatePatientProfileDto,
  ) {
    const patient = await this.patientService.createPatientProfile(
      req.user.userId,
      createPatientDto,
    );
    return {
      statusCode: 201,
      message: 'Patient profile created successfully',
      data: patient,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req: any) {
    const patient = await this.patientService.getPatientByUserId(
      req.user.userId,
    );
    return {
      statusCode: 200,
      data: patient,
    };
  }

  @Get(':id')
  async getPatientById(@Param('id') id: string) {
    const patient = await this.patientService.getPatientById(id);
    return {
      statusCode: 200,
      data: patient,
    };
  }

  @Get()
  async getAllPatients() {
    const patients = await this.patientService.getAllPatients();
    return {
      statusCode: 200,
      data: patients,
      total: patients.length,
    };
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @Request() req: any,
    @Body() updatePatientDto: UpdatePatientProfileDto,
  ) {
    const patient = await this.patientService.updatePatientProfile(
      req.user.userId,
      updatePatientDto,
    );
    return {
      statusCode: 200,
      message: 'Patient profile updated successfully',
      data: patient,
    };
  }

  @Delete('profile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deleteProfile(@Request() req: any) {
    await this.patientService.deletePatientProfile(req.user.userId);
    return {
      statusCode: 200,
      message: 'Patient profile deleted successfully',
    };
  }
}
