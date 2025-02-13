import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';
import { CreateTripDto } from './dtos/create-trip.dto';
import { UpdateTripDto } from './dtos/update-trip.dto';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip) private readonly tripRepo: Repository<Trip>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  async createTrip(dto: CreateTripDto): Promise<Trip> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: dto.vehicleId },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const trip = this.tripRepo.create({ ...dto, vehicle });
    return this.tripRepo.save(trip);
  }

  async getTrips(): Promise<Trip[]> {
    return this.tripRepo.find({ relations: ['vehicle'] });
  }

  async getTripById(id: number): Promise<Trip> {
    const trip = await this.tripRepo.findOne({
      where: { id },
      relations: ['vehicle'],
    });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  async updateTrip(id: number, dto: UpdateTripDto): Promise<Trip> {
    const trip = await this.getTripById(id);
    Object.assign(trip, dto);
    return this.tripRepo.save(trip);
  }

  async deleteTrip(id: number): Promise<void> {
    const trip = await this.getTripById(id);
    await this.tripRepo.remove(trip);
  }
}
