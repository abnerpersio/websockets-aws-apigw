import { dynamoClient } from '@/clients/dynamo';
import { env } from '@/config/env';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

type Data = {
  connectionId: string;
  connectedAt: number;
};

export class ConnectUseCase {
  async handle(data: Data) {
    const { connectionId, connectedAt } = data;

    const putCommand = new PutCommand({
      TableName: env.connectionsTable,
      Item: {
        connectionId,
        connectedAt,
      },
    });

    await dynamoClient.send(putCommand);
  }
}
