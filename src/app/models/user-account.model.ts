import { UserStatus } from './user-status.model';
import { MetaDataValueModel } from './meta-data-value.model';

export class UserAccountModel {
    clientGuid?: string;
    clientContactId?: number;
    clientContactGuid?: string;
    clientName?: string;
    contactId?: number;
    contactNumbers?: Array<MetaDataValueModel>;
    createdBy?: number;
    email?: string;
    epUserGuid?: string;
    epUserId?: number;
    firstName?: string;
    guid?: string;
    id?: number;
    lastName?: string;
    primaryEmail?: string;
    organizations?: Array<MetaDataValueModel>;
    roles?: Array<MetaDataValueModel>;
    secondaryEmails?: Array<MetaDataValueModel>;
    statusId?: number;
    updatedBy?: number;
    websites?: Array<MetaDataValueModel>;
    clientId?: number;
    isInitialLoginCompleted?: boolean;
    cpUserAccounts?: Array<any>;
}
