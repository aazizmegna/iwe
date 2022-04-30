import { Injectable } from '@angular/core';

@Injectable()
export class SystemVariableProvider {
  public SYSTEM_PARAMS = {
    REGION: 'us-east-1',
    COGNITO_POOL: {
      UserPoolId: 'us-east-1_6qSDGrksI',
      ClientId: '6e56kqscc3dcieq6hl2alrdsm'
    }
  };
}
