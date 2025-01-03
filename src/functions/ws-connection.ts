import type { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { ConnectController } from '../controller/connect';
import { DisconnectController } from '../controller/disconnect';

type RouteKey = '$connect' | '$disconnect';

export async function handler(event: APIGatewayProxyWebsocketEventV2) {
  const routeKey = event.requestContext.routeKey as RouteKey;
  const { connectionId, connectedAt } = event.requestContext;

  if (routeKey === '$connect') {
    await new ConnectController().handle({ connectionId, connectedAt });
  }

  if (routeKey === '$disconnect') {
    await new DisconnectController().handle(connectionId);
  }

  return { statusCode: 204 };
}
