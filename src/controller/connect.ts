import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '../clients/dynamo';
import { env } from '../config/env';

type Data = {
  connectionId: string;
  connectedAt: number;
};

export class ConnectController {
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
