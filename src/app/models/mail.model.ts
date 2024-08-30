export class MailModel {
    tos: Array<string>;
    ccs: Array<string>;
    subject?: string;
    body: string;
}
