import { dynamoClient } from '@/clients/dynamo';
import { env } from '@/config/env';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

export class DisconnectUseCase {
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
