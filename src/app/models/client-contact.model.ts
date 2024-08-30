import { UserAccountModel } from './user-account.model';
import { MetaDataValueModel } from './meta-data-value.model';

export class ClientContactModel {
    clientId?: number;
    contactNumbers?: Array<MetaDataValueModel>;
    cpUser?: UserAccountModel;
    firstName?: string;
    guid?: string;
    id?: number;
    lastName?: string;
    primaryEmail?: string;
    roles?: Array<MetaDataValueModel>;
    secondaryEmails?: Array<MetaDataValueModel>;
    websites?: Array<MetaDataValueModel>;
}
