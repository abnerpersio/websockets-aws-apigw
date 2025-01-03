import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '../clients/dynamo';
import { env } from '../config/env';

export class DisconnectController {
  async handle(connectionId: string) {
    const deleteCommand = new DeleteCommand({
      TableName: env.connectionsTable,
      Key: {
        connectionId,
      },
    });

    await dynamoClient.send(deleteCommand);
  }
}
