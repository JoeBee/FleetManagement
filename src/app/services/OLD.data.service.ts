// import { Injectable } from '@angular/core';

// // export interface DataTabRowObj {
// //     rowNumber: number;
// //     imo: string;
// //     fleet: string;
// //     result: string;
// //     urlEndPoint: string;
// // }

// // // TODO - Make this an object
// // // rowNumber: index + 1,
// // // imo: '',
// // // fleet: '',
// // // result: '',
// // // urlEndPoint: ''

// // export interface FleetImoLookupObj {
// //     fleetNum: string;
// //     imo: string;
// // }

// // export interface FleetFleetIDSettingsObj {
// //     fleetNum: string;
// //     fleetId: string;
// // }

// @Injectable({
//     providedIn: 'root'
// })
// export class OLDDataService {
//     private readonly ROOT_URL = "https://services.marinetraffic.com/api/setfleet/";

//     private _imosAry: any[] = []; // Data Tab, IMO column only
//     private _imoDataColumnsAryObj: DataTabRowObj[] = []; // Data Tab, all columns

//     private _fleetImoLookupAryObj: FleetImoLookupObj[] = []; // Fleet Lookup Tab
//     private _fleetImoLookupString: string = ''; // Fleet Lookup Tab

//     private _apiKey_settings: string = ''; // Settings Tab, Top row
//     private _fleetFleetId_settingsAryObj: FleetIDSettingsObj[] = []; // Settings Tab, Fleet IDs (5 rows, 2 cols)
//     // private _settingsString: string = ''; // Settings Tab, All rows

//     constructor() {
//     }

//     // Data Tab
//     updateImoDataCols(imoDataColumns: DataTabRowObj[]) {
//         this._imosAry = imoDataColumns.map(x => x.imo);
//         this._imoDataColumnsAryObj = imoDataColumns;
//     }

//     // Fleet/IMO Lookup Tab
//     updatefleetImoLookupData(data: string) {
//         const nonEmptyLines: string[] = data.split('\n').filter(line => line.trim() !== '');
//         this._fleetImoLookupString = data;

//         // TODO Remove '\t' and use 'Fleet #' instead
//         this._fleetImoLookupAryObj = nonEmptyLines.map(line => {
//             const [fleetNum, imo] = line.trim().toLowerCase().replace('fleet', '').replace(' ', '').split('\t');
//             return { fleetNum, imo };
//         });
//         console.log('** *** ==> updatefleetImoLookupData', this._fleetImoLookupAryObj);
//     }

//     // Settings Tab
//     updateSettingsData(inputString: string): void {
//         if (inputString) {
//             // this._settingsString = inputString;
//             const rows = inputString.split('\n');

//             // Initialize the result array
//             this._fleetFleetId_settingsAryObj = [];

//             this._apiKey_settings = rows[0].trim();
//             // Start from index 1 to skip the first (API) row
//             for (let i = 1; i < rows.length; i++) {
//                 const row = rows[i].trim();

//                 // Skip empty rows or rows without a pipe character
//                 if (row === "" || !row.includes("|")) {
//                     continue;
//                 }

//                 // Split by pipe and trim both parts
//                 const parts = row.split("|").map(part => part.trim());

//                 // If we have both parts, add to our result array
//                 if (parts.length === 2) {
//                     this._fleetFleetId_settingsAryObj.push({
//                         fleetNum: parts[0].trim().toLowerCase()
//                             .replace(' ', '').replace('fleet', ''),
//                         fleetId: parts[1].trim()
//                     });
//                 }
//             }
//         }
//         else {
//             this._apiKey_settings = '';
//             this._fleetFleetId_settingsAryObj = [];
//         }
//     }

//     // ----------------------------------------------------

//     // Data Tab
//     getDataImos(): string[] {
//         return this._imosAry;
//     }

//     // Data Tab
//     getDataColumns(): DataTabRowObj[] {
//         return this._imoDataColumnsAryObj;
//     }

//     // Data Tab
//     hasImoData(): boolean {
//         return this._imoDataColumnsAryObj && this._imoDataColumnsAryObj.length > 0;
//     }

//     // Fleet/IMO Lookup Tab
//     getFleetImoLookupData(): FleetImoLookupObj[] {
//         return this._fleetImoLookupAryObj;
//     }

//     // Fleet/IMO Lookup Tab
//     getFleetImoLookupString(): string {
//         return this._fleetImoLookupString;
//     }

//     // Settings Tab
//     getApiKeySettings(): string {
//         return this._apiKey_settings;
//     }

//     // Settings Tab
//     // getSettingsString(): string {
//     //     return this._settingsString;
//     // }

//     // Settings Tab
//     getFleetFleetIdSettings(): FleetIDSettingsObj[] {
//         return this._fleetFleetId_settingsAryObj;
//     }

//     //

//     // ----------------------------------------------------
//     // *** Long Term Data Storage

//     readonly SETTINGS_API_KEY = 'HiMarineCompanyApiKey';

//     // NEW localStorage preferred instead of cookies
//     // saveApiKeySettings(apiKey: string): void {
//     //     localStorage.setItem(this.SETTINGS_API_KEY, apiKey); // JSON.stringify(myDataObject));
//     //     this._apiKey_settings = apiKey;;
//     //     // document.cookie = `${this.SETTINGS_COOKIE_NAME}=${encodeURIComponent(apiKey)}; path=/; max-age=31536000`;
//     //     // this.updateSettingsData(apiKey);  // Pass the string directly
//     // }

//     saveSettings(settingsInput: string): void {
//         // document.cookie = `${this.SETTINGS_COOKIE_NAME}=${encodeURIComponent(settingsInput)}; path=/; max-age=31536000`;
//         // console.log('** ==> settingsInput', settingsInput);
//         // this.updateSettingsData(settingsInput);  // Pass the string directly
//     }

//     loadSettings(): string {
//         // let rtnSettingsInput: string = '';
//         // const cookies = document.cookie.split(';');
//         // const settingsCookie = cookies.find(cookie => cookie.trim().startsWith(`${this.SETTINGS_COOKIE_NAME}=`));
//         // if (settingsCookie) {
//         //     const cookieValue = settingsCookie.split('=')[1];
//         //     rtnSettingsInput = decodeURIComponent(cookieValue);
//         //     this.updateSettingsData(rtnSettingsInput);  // Pass the string directly
//         // } else {
//         //     this.updateSettingsData('');  // Empty string for no data
//         // }
//         // return rtnSettingsInput;
//         return '';
//     }


//     // ----------------------------------------------------
//     // * Long Term Data Storage in browsers IndexedDB - Fleet/IMO Lookup Tab
//     private readonly DB_NAME = 'FleetLookupDB';
//     private readonly STORE_NAME = 'fleetImoData';

//     // ==> Uses IndexedDB to store the data -- The uses browser <==
//     // The data is stored locally on the user's computer, not on any server.
//     // Each browser profile maintains its own separate IndexedDB storage,
//     // and the data is specific to your domain (localhost:4200 during development).
//     // Note that if users clear their browser data and select "Site Data"
//     // or "All Data", this stored data will be deleted.
//     public async loadFleetImoLookupData(): Promise<FleetImoLookupObj[]> {
//         const db = await this.openIndexedDb();
//         const transaction = db.transaction(this.STORE_NAME, 'readonly');
//         const store = transaction.objectStore(this.STORE_NAME);
//         const request = store.get('fleetLookupData');

//         return new Promise((resolve, reject) => {
//             request.onsuccess = (event: Event) => {
//                 const target = event.target as IDBRequest;
//                 const fleetimolookupdata = target?.result;
//                 if (fleetimolookupdata) {
//                     this.updatefleetImoLookupData(fleetimolookupdata.content);
//                     this._fleetImoLookupString = this.getFleetImoLookupString();
//                     resolve(this._fleetImoLookupAryObj);
//                     // resolve(fleetimolookupdata.content); // Resolve the promise with the content
//                 } else {
//                     resolve([]); // Resolve with an empty string if no data
//                 }
//             };

//             request.onerror = (event) => {
//                 console.error('Error retrieving data:', event);
//                 reject(event); // Reject the promise on error
//             };
//         });
//     }

//     // Save to IndexedDB (browser storage)
//     public async saveFleetImoLookupData(fleetimolookupdata: string): Promise<IDBRequest> {
//         console.log('** ==> saveFleetImoLookupData', fleetimolookupdata);
//         const db = await this.openIndexedDb();
//         const transaction = db.transaction(this.STORE_NAME, 'readwrite');
//         const store = transaction.objectStore(this.STORE_NAME);
//         console.log('** TODO TODO TODO UPDATE fleetLookupData ==> store', store);
//         return await store.put({ id: 'fleetLookupData', content: fleetimolookupdata });
//     }

//     // Responsible for opening a connection to an IndexedDB database (browser storage)
//     private openIndexedDb(): Promise<IDBDatabase> {
//         return new Promise((resolve, reject) => {
//             const request = indexedDB.open(this.DB_NAME, 1);

//             request.onerror = () => reject(request.error);
//             request.onsuccess = () => resolve(request.result);

//             request.onupgradeneeded = (event: any) => {
//                 const db = event.target.result;
//                 if (!db.objectStoreNames.contains(this.STORE_NAME)) {
//                     db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
//                 }
//             };
//         });
//     }

//     // ----------------------------------------------------

//     // getUrlEndPoint(imo: string, action: string, fleetId: string): string {
//     //     return `${this.ROOT_URL}/${this._apiKey_settings}/imo:${imo}/${action}/fleet_id:${fleetId}`;
//     // }

// }


