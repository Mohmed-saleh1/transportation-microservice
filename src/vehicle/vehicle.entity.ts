import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VehicleType, VehicleStatus } from './vehicle.types';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  brand: string;

  @Column({ type: 'enum', enum: VehicleType })
  type: VehicleType;

  @Column({ length: 20, unique: true })
  licensePlate: string;

  @Column()
  capacity: number;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  currentLocation: string;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
  })
  status: VehicleStatus;

  @Column({ nullable: true })
  driverId: number;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
