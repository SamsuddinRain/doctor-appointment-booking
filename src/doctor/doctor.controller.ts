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
import { DoctorService } from './doctor.service';
import { CreateDoctorProfileDto, UpdateDoctorProfileDto } from '../common/dto';

@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Post('profile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @Request() req: any,
    @Body() createDoctorDto: CreateDoctorProfileDto,
  ) {
    const doctor = await this.doctorService.createDoctorProfile(
      req.user.userId,
      createDoctorDto,
    );
    return {
      statusCode: 201,
      message: 'Doctor profile created successfully',
      data: doctor,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req: any) {
    const doctor = await this.doctorService.getDoctorByUserId(req.user.userId);
    return {
      statusCode: 200,
      data: doctor,
    };
  }

  @Get(':id')
  async getDoctorById(@Param('id') id: string) {
    const doctor = await this.doctorService.getDoctorById(id);
    return {
      statusCode: 200,
      data: doctor,
    };
  }

  @Get()
  async getAllDoctors(@Body('specialization') specialization?: string) {
    const doctors = await this.doctorService.getAllDoctors(specialization);
    return {
      statusCode: 200,
      data: doctors,
      total: doctors.length,
    };
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @Request() req: any,
    @Body() updateDoctorDto: UpdateDoctorProfileDto,
  ) {
    const doctor = await this.doctorService.updateDoctorProfile(
      req.user.userId,
      updateDoctorDto,
    );
    return {
      statusCode: 200,
      message: 'Doctor profile updated successfully',
      data: doctor,
    };
  }

  @Put('status')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(@Request() req: any, @Body() statusDto: any) {
    const doctor = await this.doctorService.updateDoctorStatus(
      req.user.userId,
      statusDto.status,
    );
    return {
      statusCode: 200,
      message: 'Doctor status updated successfully',
      data: doctor,
    };
  }

  @Delete('profile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deleteProfile(@Request() req: any) {
    await this.doctorService.deleteDoctorProfile(req.user.userId);
    return {
      statusCode: 200,
      message: 'Doctor profile deleted successfully',
    };
  }

  @Get('search/:query')
  async searchDoctors(@Param('query') query: string) {
    const doctors = await this.doctorService.searchDoctors(query);
    return {
      statusCode: 200,
      data: doctors,
      total: doctors.length,
    };
  }
}
