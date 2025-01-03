import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';

export const apigwClient = new ApiGatewayManagementApiClient({
  endpoint: 'https://xp1vx09v40.execute-api.us-east-1.amazonaws.com/dev',
});
