import * as models from 'powerbi-models';
import { IEmbedConfiguration } from 'powerbi-client';

export const tenantConfig = {
    clientID: 'ba09d6ab-c11f-482b-9190-1ec8eb01c106',
    baseURL: 'https://enkelclients.b2clogin.com',
    tenant: 'enkelclients.onmicrosoft.com',
    signInPolicy: 'B2C_1_EnkelConnect_SignInOnly',
    forgotPasswordPolicy: 'B2C_1_EnkelClient_PasswordReset',
    scopes: ['https://enkelclients.onmicrosoft.com/demo/read'],
    validateAuthority: false,
    authority: 'https://enkelclients.b2clogin.com/tfp/enkelclients.onmicrosoft.com/B2C_1_EnkelConnect_SignInOnly',
    cacheLocation: 'sessionStorage',
};

export const reportConfig: IEmbedConfiguration = {
    type: '',
    accessToken: '',
    embedUrl: '',
    id: '',
    tokenType: models.TokenType.Embed,
    pageView: 'fitToWidth',
    settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: false,
    }
};

export const forgotPasswordAuthority = `${tenantConfig.baseURL}/tfp/${tenantConfig.tenant}/${tenantConfig.forgotPasswordPolicy}`;
export const loginAuthority = `${tenantConfig.baseURL}/tfp/${tenantConfig.tenant}/${tenantConfig.signInPolicy}`;

