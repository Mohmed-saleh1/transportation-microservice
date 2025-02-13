import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tracking } from './tracking.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';
import { TrackingGateway } from './tracking.gateway';
import { CreateTrackingDto } from './dtos/create-track.dto';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Tracking)
    private readonly trackingRepo: Repository<Tracking>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @Inject(forwardRef(() => TrackingGateway))
    private readonly trackingGateway: TrackingGateway,
  ) {}

  async pushLocation(dto: CreateTrackingDto): Promise<Tracking> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: dto.vehicleId },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const trackingData = this.trackingRepo.create({ ...dto, vehicle });
    await this.trackingRepo.save(trackingData);

    // Emit real-time update to all connected clients
    this.trackingGateway.server.emit(
      `locationUpdate:${dto.vehicleId}`,
      trackingData,
    );

    return trackingData;
  }

  async getVehicleLocation(vehicleId: number): Promise<Tracking> {
    const latestTracking = await this.trackingRepo.findOne({
      where: { vehicle: { id: vehicleId } },
      order: { timestamp: 'DESC' },
    });

    if (!latestTracking)
      throw new NotFoundException('No tracking data found for this vehicle');
    return latestTracking;
  }
}
