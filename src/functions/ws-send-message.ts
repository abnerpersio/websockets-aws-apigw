import { apigwClient } from '@/clients/apigw';
import { dynamoClient } from '@/clients/dynamo';
import { env } from '@/config/env';
import { Connection } from '@/entities/connection';
import {
  Controller,
  HttpResult,
  WSAdapter,
  WSPayload,
} from '@/lib/adapters/ws';
import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { paginateScan } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';

type Body = {
  text: string;
};

class SendMessageController implements Controller {
  async handle(payload: WSPayload<any, Body>): Promise<HttpResult> {
    const { text } = payload.body;
    const id = randomUUID();

    const paginator = paginateScan(
      { client: dynamoClient },
      { TableName: env.connectionsTable }
    );

    for await (const { Items = [] } of paginator) {
      const list = Items as Connection[];

      await Promise.allSettled(
        list
          // .filter(({ connectionId }) => connectionId !== payload.connection.id)
          .map(async ({ connectionId }) => {
            const postToConnectionCommand = new PostToConnectionCommand({
              ConnectionId: connectionId,
              Data: JSON.stringify({ id, text }),
            });

            await apigwClient.send(postToConnectionCommand);
          })
      );
    }

    return { statusCode: 204 };
  }
}

const controller = new SendMessageController();
export const handler = new WSAdapter(controller).adapt;
