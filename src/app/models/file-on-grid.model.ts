export class FileOnGrid {
    id: number;
    guid: string;
    clientId ?: number;
    clientName?: string;
    clientEmail?: string;
    isFolder ?: string;
    name ?: string;
    reportType ?: string;
    period ?: Date;
    expiredAt ?: Date;
    action ?: string;
    description ?: string;
    purpose ?: string;
    size ?: number;
    uploadedAt ?: Date;
    parentDirectoryGuid?: string;
    parentDirectoryId?: number;
    childDirectories?: Array<any>;
    fileMetaData?: any;
}
