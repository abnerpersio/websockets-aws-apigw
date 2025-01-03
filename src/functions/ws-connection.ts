import {
  Controller,
  HttpResult,
  WSAdapter,
  WSPayload,
} from '@/lib/adapters/ws';
import { ConnectUseCase } from '@/use-cases/connect';
import { DisconnectUseCase } from '@/use-cases/disconnect';

type RouteKey = '$connect' | '$disconnect';

class WSConnectionController implements Controller {
  async handle(payload: WSPayload<RouteKey>): Promise<HttpResult> {
    const { key, connection } = payload;

    if (key === '$connect') {
      await new ConnectUseCase().handle({
        connectionId: connection.id,
        connectedAt: connection.connectedAt,
      });
    }

    if (key === '$disconnect') {
      await new DisconnectUseCase().handle(connection.id);
    }

    return { statusCode: 204 };
  }
}

const controller = new WSConnectionController();
export const handler = new WSAdapter(controller).adapt;
