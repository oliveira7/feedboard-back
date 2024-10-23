import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway()
export class FeedGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('sendNewPost')
  handleNewPost(@MessageBody() post: any) {
    this.server.emit('sendNewPost', post);
  }

  @SubscribeMessage('sendNewReaction')
  handleNewReaction(@MessageBody() reaction: any) {
    this.server.emit('sendNewReaction', reaction);
  }
}
