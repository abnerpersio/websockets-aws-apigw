import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';

export type WSPayload<TKey = string, TBody = Record<string, unknown>> = {
  key: TKey;
  body: TBody;
  connection: {
    id: string;
    connectedAt: number;
  };
};

export type HttpResult = {
  statusCode: number;
};

export interface Controller {
  handle(payload: any): Promise<HttpResult>;
}

export class WSAdapter<TKey = string, TBody = Record<string, unknown>> {
  constructor(private readonly controller: Controller) {}

  adapt = async (event: APIGatewayProxyWebsocketEventV2) => {
    try {
      const routeKey = event.requestContext.routeKey as TKey;

      const { statusCode } = await this.controller.handle({
        key: routeKey,
        body: JSON.parse(event.body || '{}') as TBody,
        connection: {
          id: event.requestContext.connectionId,
          connectedAt: event.requestContext.connectedAt,
        },
      } satisfies WSPayload<TKey, TBody>);

      return { statusCode };
    } catch (error) {
      console.error('Error occurred:', error);
      return { statusCode: 500 };
    }
  };
}
