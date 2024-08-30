export class Constants {
    public static appConstants = {
        APP_NAME: 'Client Portal',
        MINIMUM_LENGTH: 1,
        METADATA_MAXIMUM_LENGTH: 5,
        MAXIMUM_MAIL_CC_COUNT: 15,
        MAX_MAIL_SUBJECT_LIMIT: 100,
        MAX_MAIL_BODY_LIMIT: 1000,
        MINIMUM_DATA_LENGTH: 0,
        REPORT_TABS: ['Income Statement', 'Balance Sheet'],
        WELCOME: '',
        DASHBOARD: 'Latest Reports',
        REPORTS: 'Historical Financial Statements',
        REPORT_DETAILS: 'Report Details',
        FILES: 'Uploaded Files',
        UPLOAD_FILES: 'Files',
        USER_SETTINGS: 'User Profile',
        CSL_CONNECT: 'Contact CSL',
        USER_GUIDE: 'User Guide',
        SUPPORT: 'Support',
        WORK_ITEM: 'Work List',
        DEFAULT_TITLE: 'Client Portal',
        DASHBOARD_IMG: '../assets/images/Latest_reports.svg',
        REPORTS_IMG: '../assets/images/Historical_financial_statements.svg',
        FILES_IMG: '../assets/images/Files.svg',
        USER_IMG: '../assets/images/user_profile.svg',
        CSL_IMG: '../assets/images/CSL_connect.svg',
        SUPPORT_IMG: '../assets/images/CSL_connect.svg',
        WORK_ITEM_IMG: '../assets/images/CSL_connect.svg',
        USER_GUIDE_IMG: '../assets/images/guide_icon.svg',
        LOGIN_BACKGROUND_IMG: './assets/images/login_screen_background.png',
        HOME_BACKGROUND_IMG: './assets/images/Home_screen_background.png',
        LOADER_IMG: './assets/images/Enkel_logo_loading_page.svg',
        LOG_OUT_IMG: '../assets/images/Log_out.svg',
        FILE_UPLOAD: 'Drag files here or click to upload',
        MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ENKEL_URL: 'https://www.enkel.ca/',
        MAX_SIZE_FOR_SUPPORT_TICKET_ATTACHMENT: 15000000
    };

    public static notifications = {
        NOTIFICATION_DURATION: 5,
        ERROR_LABEL: '',
        SUCCESS: '',
        UPDATE_SUCCESS: 'Updated Successfully',
        MAIL_SUCCESS: 'Email successfully sent',
        LINK_COPIED: 'Link copied'
    };

    public static loginConstants = {
        FORGOT_PASSWORD_ERROR_CODE: 'AADB2C90118',
        CANCELLED_WINDOW_ERROR: 'AADB2C90091',
        CLOSED_POPUP: 'user_cancelled',
        GUEST_USER: 'Guest',
    };

    public static styleConstants = {
        SPINNER_COLOR: 'accent',
        BLUE_THEME: '#2196F3'
    };

    public static msal = {
        LOGIN_FAILURE: 'msal:loginFailure',
        LOGIN_SUCCESS: 'msal:loginSuccess',
        GET_TOKEN_SUCCESS: 'msal:acquireTokenSuccess',
        GET_TOKEN_FAILURE: 'msal:acquireTokenFailure',
    };

    public static navigations = {
        LOGIN: 'login',
        WELCOME: 'welcome',
        ENKEL_CLIENT: 'enkel-clients',
        REPORTS: 'historical-financial-statements',
        REPORT_INCOME: 'report-sheet-income',
        REPORT_BALANCE: 'report-sheet-balance',
        DASHBOARD: 'latest-reports',
        FILES: 'files',
        FILES_UPLOADER: 'files-uploader',
        BALANCE_SHEET: 'balance-sheet',
        INCOME_STATEMENT: 'income-statement',
        SETTINGS: 'settings',
        ACCOUNT_DETAILS: 'account-details',
        USERS: 'users',
        EDIT: 'edit',
        CSL_CONNECT: 'connect-to-csl',
        REPORT_UPLOAD: 'reports',
        USER_GUIDE: 'user-guide',
        SUPPORT: 'support',
        WORK_ITEM: 'work-list',
        MY_WORK_ITEMS: 'my-work-items',
        WATCHED_WORK_ITEMS: 'watched-work-items'
    };

    public static localstorageKeys = {
        ACCESS_TOKEN: 'token',
        NAME: 'given_name',
        EMAIL: 'emails',
        EP_USER_ID: 'epUserId',
        ID: 'id',
        GUID: 'guid',
        CLIENT_GUID: 'client_guid',
        JWT: 'jwt',
        CLIENT_ID: 'client_id',
        ROLE_ID: 'role_id',
        EP_USER_AS_CLIENT: 'isEpUserAsClient',
        IS_INITIAL_LOGIN_COMPLETED: 'isInitialLoginCompleted',
        ACCOUNT_GUID: 'accountGuid',
        ACCOUNT_ID: 'accountId',
    };

    public static fileUploadPercentage = {
        INITIAL: 0,
        FINAL: 99,
        DONE: 100,
        ERROR: ''
    };

    public static requestHeaders = {
        CONTENT_TYPE_KEY: 'Content-Type',
        CONTENT_TYPE_VALUE: 'application/json',
        AUTHORIZATION_HEADER_KEY: 'Authorization',
        SECURITY_SCHEME: 'Bearer '
    };

    public static endPoints = {
        LOGIN: 'auth/login',
        USERS: 'users',
        GET_REPORTS: 'reports',
        GET_CONTACTS: 'client-contacts/clients',
        CREATE_CONTACT: 'client-contacts',
        GET_ROLES: 'roles',
        GET_CLIENTS: 'clients/users',
        STATUS: 'status',
        CSL_INFO: 'users/success-leads',
        CSL_MAIL: 'emails',
        GET_REPORTS_FOR_TABLE: 'reports/downloads',
        GET_FILES_FOR_TABLE: 'directories/root',
        REPORT_UPLOAD: 'reports/uploads',
        REPORT_DOWNLOAD: 'reports/downloads',
        FILE_UPLOAD: 'files',
        FILE_DOWNLOAD: 'files',
        REPORT_DELETE: 'reports',
        FILE_DELETE: 'files',
        CREATE_FOLDER: 'directories',
        GET_FOLDER_BY_ID: 'directories',
        FOLDER_DELETE: 'directories',
        ACCOUNT_CHANGE: '/auth/accounts',
        SUPPORT_TICKET: 'supports',
        SUPPORT_TICKET_ATTACHMENT: 'support-attachments',
        SUPPORT_TICKET_RESPONSES: 'support-responses',
        SUPPORT_TICKET_METADATA: 'metadata',
        WORK_ITEM: 'work-items',
        WORK_ITEM_WATCHERS: 'watchers',
        WORK_ITEM_CHILDREN: 'child-work-items',
        WORK_ITEM_ATTACHMENT: 'work-items-attachments',
        WORK_ITEM_COMMENTS: 'work-item-comments'
    };

    public static symbols = {
        queryParamSymbol: '?',
        pathVariableSymbol: '/',
        andSymbol: '&',
        equalSymbol: '=',
        space: ' ',
        underScore: '_',
        stringInitialization: ''
    };

    public static errorCodes = {
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404
    };

    public static ContactStatus = {
        ACTIVE: 'Active',
        PENDING: 'Pending',
        INACTIVE: 'Inactive',
        NOT_INVITED: 'Not invited'
    };

    public static ContactActions = {
        REMOVE_ACCESS: 'Remove Access',
        GRANT_ACCESS: 'Grant Access'
    };

    public static FormControlNames = {
        CP_USER_SECONDARY_EMAILS: 'cpUserSecondaryEmails',
        CP_USER_PHONE_NUMBERS: 'cpUserPhoneNumbers',
        MY_ACCOUNT_SECONDARY_EMAILS: 'myAccountSecondaryEmails',
        MY_ACCOUNT_PHONE_NUMBERS: 'myAccountPhoneNumbers',
        MY_ACCOUNT_WEBSITES: 'myAccountWebsites',
        FILE_TO_BE_UPLOAD: 'fileToBeUploaded'
    };

    public static StartTour = {
        FIRST_STEP: 'firstStep',
        FIRST_STEP_TITLE: 'Companies',
        FIRST_STEP_TEXT: 'Toggle between your company accounts to filter reports',
        SECOND_STEP: 'secondStep',
        SECOND_STEP_TITLE: 'Latest Reports',
        SECOND_STEP_TEXT: 'Easy access to your most recent monthly financial statements',
        THIRD_STEP: 'thirdStep',
        THIRD_STEP_TITLE: 'Historical Financial Statements',
        THIRD_STEP_TEXT: 'All prior financial statements in one place.',
        FOURTH_STEP: 'fourthStep',
        FOURTH_STEP_TITLE: 'Files',
        FOURTH_STEP_TEXT: 'Collaboration made easy. Upload files and your Client Success Lead will be notified.',
        FIFTH_STEP: 'fifthStep',
        FIFTH_STEP_TITLE: 'Contact CSL',
        FIFTH_STEP_TEXT: 'Reach out to your Client Success Lead directly.',
        SIXTH_STEP: 'sixthStep',
        SIXTH_STEP_TITLE: 'Support',
        SIXTH_STEP_TEXT: 'See your support tickets',
        // TO BE ADDED LATER
        // SIXTH_STEP: 'sixthStep',
        // SIXTH_STEP_TITLE: 'User Guide',
        // SIXTH_STEP_TEXT: 'Your step-by-step guide for using this app.',
        SEVENTH_STEP: 'seventhStep',
        SEVENTH_STEP_TITLE: 'Work List',
        SEVENTH_STEP_TEXT: 'See your work items',
        EIGHTH_STEP: 'eighthStep',
        EIGHTH_STEP_TITLE: 'User Profile',
        EIGHTH_STEP_TEXT: 'Update your contact information and permission control.'
    };

    public static DialogConstants = {
        DEFAULT_WIDTH: '500px',
        FILE_WIDTH: '800px',
    };

    public static errorMessages = {
        incorrectPrimaryEmailLabel: 'Please enter a valid email',
        incorrectContactLabel: 'Please enter a valid contact number',
        incorrectEmailLabel: 'Email Already Exist',
        incorrectPhoneLabel: 'Phone number Already Exist',
        NO_USER_FOUND: 'No User found',
        FILE_FORMAT: 'Only pdf format files',
        FILE_SIZE: 'File size should be less than 100 MB.',
        NO_DATA_FOUND: 'No Data Found',
        SUPPORT_TICKET_ATTACHMENT_SIZE: 'Attachment size should be less than 15 MB',
    };

    public static textEffectTiming = {
        timeSpanBetweenCharacters : 70,
        timeSpanAtSentenceComplete : 700
    };

    public static queryParameters = {
        PAGE: 'page',
        PAGE_SIZE: 'pageSize',
        INITIAL_PAGE: 1,
        USER_GUID: 'userGuid',
        USER_ID: 'userId',
        CLIENT_GUID: 'clientGuid',
        CLIENT_ID: 'clientId',
        DOCUMENT_TYPE: 'documentType',
        DIRECTORY_TYPE: 'directoryType',
        IS_SUCCESS_LEAD: 'isSuccessLead',
        WITH_DATA: 'withData',
        SUPPORT_TICKET_ID: 'supportTicketId',
        SUPPORT_TICKET_GUID: 'supportTicketGuid',
        IS_WATCHED_WORK_ITEMS: 'isWatchedWorkItems',
        WORK_ITEM_ID: 'workItemId',
        WORK_ITEM_GUID: 'workItemGuid',
    };

    public static helpTextMessages = {
        mailPrivacy: 'We\'ll never share your email with anyone else.',
        MAIL_SUBJECT_FOR_CSL: 'New mail from ',
        MAIL_BODY_SALUTATION_FOR_CSL: 'Hi ',
        MAIL_BODY_REPLY_FOR_CSL: `\n\n//Type your message here.`,
        MAIL_BODY_GREETINGS_FOR_CSL: `\n\nThanks \n`,
        MAIL_BODY_FOR_CLIENT: 'You can access it by clicking on this link before ',
        SENDER_CSL: 'Enkel BackOffice Solutions Inc.',
        DELETE_HEADING: 'Delete Confirmation',
        DELETE_BODY: 'Do you want to delete this ',
        SUBMIT_SUPPORT_TICKET_RESPONSE_HEADER: 'Submit Respose',
        SUBMIT_SUPPORT_TICKET_RESPONSE_BODY: 'Submit response to this ticket?',
    };

    public static paramKeys = {
        loggedInUserGuid: 'loggedInUserGuid'
    };

    public static fileUploadKeys = {
        CLIENT_ID : 'ClientId',
        EXPIRED_AT : 'ExpiredAt',
        FILE : 'File',
        PERIOD : 'Period',
        NAME: 'Name',
        DESCRIPTION: 'Description',
        DESCRIPTION_TYPE: 'DocumentType',
        PURPOSE: 'Purpose',
        ACTION_REQUIRED: 'Action',
        REPORT_TYPE : 'ReportType',
        UPDATED_BY : 'UpdatedBy',
        UPLOADED_BY : 'UploadedBy',
        YEAR : 'Year',
        ID: 'Id',
        GUID: 'Guid',
        DIRECTORY_ID: 'DirectoryId'
    };

    public static allowedFileFormat = {
        PDF: 'application/pdf',
        ALL: '*',
        MAX_SIZE: 104857600
    };

    public static DateFormats = {
        DD_MMMM_YYYY: 'dd MMMM yyyy'
    };

    public static previewer = {
        GOOGLE_VIEWER: 'google',
        OFFICE_VIEWER: 'office'
    };

    public static supportTicketOptions = {
        TICKET_STATUS: [
            { name: 'Closed', id: 1, color: '#6C757D' },
            { name: 'Completed', id: 2, color: '#00CDB8' },
            { name: 'In Progress', id: 3, color: '#86E7DE' },
            { name: 'Read', id: 4, color: '#400094' },
            { name: 'Unread', id: 5, color: '#FF4E4C' }
        ]
    };

    public static routingParameters = {
        id: 'id',
        GUID: 'guid',
        WORK_ITEM_TYPE: 'workItemType',
        PARENT_WORK_ITEM_GUID: 'parentWorkItemGuid',
        WORK_ITEM_TEMPLATE: 'isTemplate'
    };

    public static workItemFormData = {
        ATTACHMENTS: 'Attachments',
        CLIENT_ID: 'ClientId',
        CP_USER_ID: 'CPUserId',
        CREATED_BY: 'CreatedBy',
        DESCRIPTION: 'Description',
        END_DATE: 'EndDate',
        ID: 'Id',
        IS_ASSIGNEE_NOTIFIED: 'IsAssigneeNotified',
        IS_RECURRING_ITEM: 'IsRecurring',
        GUID: 'Guid',
        PARENT_WORK_ITEM_GUID: 'ParentWorkItemGuid',
        NAME: 'Name',
        PROPOSAL_ID: 'ProposalId',
        START_DATE: 'StartDate',
        UPDATED_BY: 'UpdatedBy',
        USER_ID: 'UserId',
        WORK_ITEM_ID: 'WorkItemId',
        WORK_ITEM_PRIORITY_ID: 'WorkItemPriorityId',
        WORK_ITEM_VISIBILITY_ID: 'WorkItemVisibilityId',
        WORK_ITEM_STATUS_ID: 'WorkItemStatusId',
        WORK_ITEM_TYPE_ID: 'WorkItemTypeId',
        WORK_ITEM_TEMPLATE_ID: 'TemplateId',
        SUPPORT_TICKET_ID: 'SupportTicketId'
    };

    public static localStorageData = {
        ID: 'id',
        GUID: 'guid'
    };

    public static workListStatus = [
        { viewValue: 'Assigned', value: 1, color: '#400094' },
        { viewValue: 'Closed', value: 2, color: '#6C757D' },
        { viewValue: 'Completed', value: 3, color: '#00CDB8' },
        { viewValue: 'In Progress', value: 4, color: '#ffd401' },
        { viewValue: 'New', value: 5, color: '#FF4E4C' }
    ];

    public static workListPriority = [
        { viewValue: 'High', value: 1, color: '#FF4E4C' },
        { viewValue: 'Low', value: 2, color: '#6C757D' },
        { viewValue: 'Normal', value: 3, color: '#00CDB8' }
    ];

    public static workListVisibilty = [
        { viewValue: 'External', value: 1 },
        { viewValue: 'Internal', value: 2 }
    ];

    public static workItemType = [
        { viewValue: 'Sub Task', id: 1, color: '#40009440' },
        { viewValue: 'Task', id: 2, color: '#4000948a' },
        { viewValue: 'Work Item', id: 3, color: '#400094' },
    ];

    public static WindowActions = {
        blank: '_blank'
    };
}
