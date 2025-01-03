import { env } from '@/config/env';
import { Connection } from '@/entities/connection';
import { GetConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { DeleteCommand, paginateScan } from '@aws-sdk/lib-dynamodb';
import { apigwClient } from '../clients/apigw';
import { dynamoClient } from '../clients/dynamo';

export async function handler() {
  const paginator = paginateScan(
    { client: dynamoClient },
    { TableName: env.connectionsTable }
  );

  for await (const { Items = [] } of paginator) {
    const list = Items as Connection[];

    await Promise.allSettled(
      list.map(async ({ connectionId }) => {
        try {
          const getConnectionCommand = new GetConnectionCommand({
            ConnectionId: connectionId,
          });

          await apigwClient.send(getConnectionCommand);
        } catch {
          const deleteCommand = new DeleteCommand({
            TableName: env.connectionsTable,
            Key: { connectionId },
          });
          dynamoClient.send(deleteCommand);
        }
      })
    );
  }
}
