import { MetaDataValueModel } from './meta-data-value.model';

export class ChangeRoleModel {
    id: string;
    guid: string;
    roles: Array<MetaDataValueModel>;
}
