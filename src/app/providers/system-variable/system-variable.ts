import { Injectable } from '@angular/core';

@Injectable()
export class SystemVariableProvider {
  public SYSTEM_PARAMS = {
    REGION: 'eu-central-1',
    COGNITO_POOL: {
      UserPoolId: 'eu-central-1_qgsRBlmTw',
      ClientId: '5dq1dkpbst95ik2qn6dgn8f8v0'
    }
  };
}
