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

  @SubscribeMessage('pushLocation')
  async handlePushLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateTrackingDto,
  ) {
    try {
      const trackingData = await this.trackingService.pushLocation(dto);

      // Emit update to all clients
      this.server.emit(`locationUpdate:${dto.vehicleId}`, trackingData);

      // Send success response back to the sender
      return { status: 'success', data: trackingData };
    } catch (error) {
      console.error('Error in pushLocation:', error.message);

      // Send error response to the client that sent the request
      return { status: 'error', message: error.message };
    }
  }
}
