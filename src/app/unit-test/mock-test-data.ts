import { UserAccountModel } from '../models/user-account.model';
import { MailModel } from '../models/mail.model';
import { DirectoriesModel } from '../models/directories.model';
import { HttpEvent } from '@angular/common/http';

export const userTestData = {
    clientContactId: 4,
    clientContactGuid: '113681dc-d92d-4233-975d-f18a71f1de17',
    clientName: null,
    contactNumbers: [{ id: 2, name: '2131321231232412' }],
    cpUserAccounts: [{
        clientId: 431,
        clientGuid: '23dd6bf1-cddf-438e-ad57-b4dfcadd9e2a',
        clientName: 'GladStone',
        cpUserId: 54,
        createdBy: 1,
        guid: '41cb1f5e-7a5f-433f-8e28-1cce7b04dac1',
        id: 7, roleId: 2, role: 'User', updatedBy: 1
    },
    {
        clientId: 437,
        clientGuid: '01b39a3e-9f02-456c-a32b-0cc96d08fc99',
        clientName: 'movmi Shared Transportation Services Inc. (movmi)',
        cpUserId: 54, createdBy: 1, guid: '8a54cb8e-2ff3-4411-a1b3-4fa9e6d85225',
        id: 8, roleId: 2, role: 'User', updatedBy: 1
    },
    {
        clientId: 436, clientGuid: '127e7289-cbed-42d2-885a-77514c1a5187',
        clientName: 'Robotix Education Inc', cpUserId: 54, createdBy: 1,
        guid: 'ba54ee3c-30a8-4e91-8df0-93acd9b6e7c0', id: 9, roleId: 2,
        role: 'User', updatedBy: 1
    }
    ],
    createdBy: 1,
    firstName: 'Ashutosh',
    guid: '92d8daa2-985b-41ac-930b-e8e30fa05b56',
    id: 54, isInitialLoginCompleted: true, lastName: 'Tiwari',
    organizations: [], primaryEmail: 'utkarsh.awasthi@optimusinfo.com',
    secondaryEmails: [], statusId: 1, updatedBy: 1, websites: []
};

export const updateAccountData: UserAccountModel = {
    clientContactGuid: '113681dc-d92d-4233-975d-f18a71f1de17',
    clientContactId: 4, clientName: null,
    contactNumbers: [{ id: 2, name: '2131321231232412' }],
    cpUserAccounts: [{
        clientId: 431, clientGuid: '23dd6bf1-cddf-438e-ad57-b4dfcadd9e2a',
        clientName: 'GladStone', cpUserId: 54, createdBy: 1,
        guid: '41cb1f5e-7a5f-433f-8e28-1cce7b04dac1', id: 7,
        roleId: 2, role: 'User', updatedBy: 1
    }, {
        clientId: 437, clientGuid: '01b39a3e-9f02-456c-a32b-0cc96d08fc99',
        clientName: 'movmi Shared Transportation Services Inc. (movmi)',
        cpUserId: 54, createdBy: 1, guid: '8a54cb8e-2ff3-4411-a1b3-4fa9e6d85225',
        id: 8, roleId: 2, role: 'User', updatedBy: 1
    }, {
        clientId: 436, clientGuid: '127e7289-cbed-42d2-885a-77514c1a5187',
        clientName: 'Robotix Education Inc', cpUserId: 54, createdBy: 1,
        guid: 'ba54ee3c-30a8-4e91-8df0-93acd9b6e7c0', id: 9, roleId: 2,
        role: 'User', updatedBy: 1
    }],
    createdBy: 1, firstName: 'Utkarsh',
    guid: '92d8daa2-985b-41ac-930b-e8e30fa05b56',
    id: 54, lastName: 'Awasthi',
    primaryEmail: 'utkarsh.awasthi@optimusinfo.com',
    secondaryEmails: [], statusId: 1, updatedBy: 54, websites: []
};

export const cslDetails = {
    clientContactId: 0, clientContactGuid: null,
    clientName: 'Steve\'s Poke Bar (Brewery District) Inc.',
    contactNumbers: [], cpUserAccounts: null, createdBy: 0,
    firstName: 'Gaurav', guid: null, id: 0,
    isInitialLoginCompleted: false,
    lastName: 'Kumar', organizations: [],
    primaryEmail: 'gaurav.kumar@optimusinfo.com',
    secondaryEmails: [], statusId: 0, updatedBy: 0, websites: []
};

export const sendMockMailToCSL: MailModel = {
    tos: ['test@test.com'],
    ccs: [],
    subject: 'Test data',
    body: 'Test email body for CSL'
};

export const clientContactMockList = {
    currentPage: 1, totalPages: 0, pageSize: 0, totalCount: 8,
    data: [{
        clientId: 514, cpUser: null, contactNumbers: [],
        firstName: 'Brendan', guid: 'ef6dc687-ba5a-492d-b1cc-6e23a8d14e8a',
        id: 234, lastName: 'Starck', organizations: [],
        primaryEmail: 'brendan@gladstonebrewing.ca',
        secondaryEmails: [], websites: []
    }, {
        clientId: 514, cpUser: null, contactNumbers: [],
        firstName: 'Tak', guid: 'f97c55af-a4ae-421f-81d4-b51297d9d9d6',
        id: 389, lastName: 'Guenette', organizations: [],
        primaryEmail: 'tak@gladstonebrewing.ca', secondaryEmails: [],
        websites: []
    }
    ],
    hasPrevious: false, hasNext: false
};

export const getReportAndFileList = {
    childDirectories: [{
        childDirectories: null,
        clientId: 91, createdAt: '2020-06-26T10:08:48.0702242',
        createdBy: 0, directoryTypeId: 2, fileMetaData: null, id: 65,
        guid: 'ece038d5-1eef-437c-a710-4358b0423512',
        name: 'Shubham\'s Reports', parentDirectoryId: 2,
        parentDirectoryGuid: '1227d4ef-d8dd-48cc-a6d6-b7d098ed321b',
        reportMetaData: null, updatedBy: 0
    }, ],
    clientId: 0, createdAt: '2020-09-10T12:16:01.6317183', createdBy: 0,
    directoryTypeId: 2, fileMetaData: null, id: 2,
    guid: '1227d4ef-d8dd-48cc-a6d6-b7d098ed321b',
    name: 'Report', parentDirectoryId: 0, parentDirectoryGuid: null,
    reportMetaData: [{
        clientEmail: 'shubham.tiwari@optimusinfo.com', clientId: 91,
        clientName: 'Shubham Tiwari', directoryId: 2,
        expiredAt: '2020-12-31T00:00:00', file: null,
        guid: '922a5f2c-42b0-4667-b0b9-9007a547e82a',
        id: 19, name: 'calendar.pdf', period: '2020-08-31T00:00:00',
        reportType: 'test', updatedBy: 1, uploadedBy: 1
    }, {
        clientEmail: 'shubham.tiwari@optimusinfo.com', clientId: 91,
        clientName: 'Shubham Tiwari', directoryId: 2,
        expiredAt: '2020-12-31T00:00:00', file: null,
        guid: 'a7dfbc0f-3ec7-4258-bf28-7f076c75f059',
        id: 18,
        name: 'Optimus+India+Holiday+Calendar+-+2019.pdf',
        period: '2020-08-31T00:00:00', reportType: 'test',
        updatedBy: 1, uploadedBy: 1
    }, {
        clientEmail: 'shubham.tiwari@optimusinfo.com',
        clientId: 91, clientName: 'Shubham Tiwari', directoryId: 2,
        expiredAt: '2020-09-30T00:00:00', file: null,
        guid: 'e6c2c5c4-8679-484a-8ca3-48f8a4336ac6', id: 17, name: 'tiwari.pdf',
        period: '2020-08-31T00:00:00', reportType: 'tiwaru', updatedBy: 1, uploadedBy: 1
    },
    ], updatedBy: 0
};

export const mockFolderData = {
    childDirectories: [],
    clientId: 91,
    createdAt: '2020-06-26T10:08:48.0702242',
    createdBy: 0,
    directoryTypeId: 2,
    fileMetaData: null,
    guid: 'ece038d5-1eef-437c-a710-4358b0423512',
    id: 65,
    name: 'Shubham\'s Reports',
    parentDirectoryGuid: '1227d4ef-d8dd-48cc-a6d6-b7d098ed321b',
    parentDirectoryId: 2,
    reportMetaData: [{ clientEmail: 'shubham.tiwari@optimusinfo.com', clientId: 91, clientName: 'Shubham Tiwari' }],
    updatedBy: 0
};

export const dashboardReportUrl = 'testReportDashboardUrl';
export const successStatusCode = 201;
export const deleteStatusCode = 204;

const createFileFromMockFile = (file): File => {
    const blob = new Blob([file.body], { type: file.mimeType }) as any;
    blob.lastModifiedDate = new Date();
    blob.name = file.name;
    return blob as File;
};
export const mockFileData = createFileFromMockFile(
    {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt'
    });

export const mockClientList = {
    currentPage: 1, totalPages: 3, pageSize: 50,
    totalCount: 123, hasNext: true, hasPrevious: false,
    data: [
        {
            assignedApplications: null,
            assignedCommonApplicationIds: null,
            clientStatus: 'churned',
            clientStatusId: 3,
            companyName: 'Aclien',
            deactivationDate: '2020-08-06T11:26:48.525951',
            displayName: 'TestFordisplayname',
            guId: '9c818eb4-c1af-4548-90df-3db0a3178367',
            id: 99,
            locale: 'noiddfsfsdfsfdsfssssdfsdf',
            logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABT0A',
            practiceIgnitionClientId: null,
            primaryEmail: 'ashutosh.tiwari@optimusinfo.com',
            proposalEndDate: '0001-01-01T00:00:00',
            remainingDays: -39,
            successLeadId: null,
            updatedBy: null,
            userIds: null
        }, {
            assignedApplications: null,
            assignedCommonApplicationIds: null,
            clientStatus: 'churned',
            clientStatusId: 3,
            companyName: 'addclienttest2',
            deactivationDate: '2020-08-05T11:19:30.5245874',
            displayName: null,
            guId: 'ee96de94-a34f-442b-9a9d-06c3b7c6edb2',
            id: 163,
            locale: null,
            logo: null,
            practiceIgnitionClientId: null,
            primaryEmail: null,
            proposalEndDate: '0001-01-01T00:00:00',
            remainingDays: -40,
            successLeadId: null,
            updatedBy: null,
            userIds: null,
        }
    ]
};

export const mockCreateFolder: DirectoriesModel = {
    childDirectories: null, clientId: 164, updatedBy: 1,
    fileMetaData: null, name: 'Test folder', parentDirectoryId: 1,
    parentDirectoryGuid: '46fb18dc-328c-43b8-8944-01209bc0b493', directoryTypeId: 2
};
