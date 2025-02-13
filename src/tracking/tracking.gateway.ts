import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateTrackingDto } from './dtos/create-track.dto';
import { TrackingService } from './tracking.service';

@WebSocketGateway({ cors: true })
export class TrackingGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly trackingService: TrackingService) {}

  @SubscribeMessage('send_location')
  async handlePushLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateTrackingDto,
  ) {
    try {
      const trackingData = await this.trackingService.pushLocation(dto);

      this.server.emit(`locationUpdate:${dto.vehicleId}`, trackingData);

      return { status: 'success', data: trackingData };
    } catch (error) {
      console.error('Error in pushLocation:', error.message);
      return { status: 'error', message: error.message };
    }
  }
}
