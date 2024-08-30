// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // serverBaseUrl: 'https://clientportalprodapi.azurewebsites.net/',
  serverBaseUrl: 'https://clientportalapidev.azurewebsites.net/',
  clientBaseUrl: 'http://localhost:7000/',
  employeePortalUrl: 'http://localhost:7000/',
  // tslint:disable-next-line: max-line-length
  userGuideDocument: 'https://docs.google.com/document/d/e/2PACX-1vQf8FUNcZBLgOvYRxN35uBZ8I7xrcvSRDApRWVMF85WoQ-th6FTdZf-HCovP14EBs-n2_pCbu7rwoc_/pub?embedded=true',
  appInsights: {
    instrumentationKey: '63e16a97-a311-4b4c-8e34-a7f4ef197cd3'
}
};




/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
