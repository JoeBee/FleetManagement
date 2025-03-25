import { Injectable } from '@angular/core';
import { DataService, FleetIDSettingsObj } from './data.service';

@Injectable({
    providedIn: 'root'
})
export class DataPersistenceService {
    private readonly DB_NAME = 'FleetManagementDB';
    private readonly DB_VERSION = 1;
    private readonly STORE_NAME = 'fleetLookupData';

    constructor(private dataService: DataService) {
        this.initIndexedDB();
    }

    // -----------------------------------------`
    // *** Long Term Data Storage

    readonly STORAGE_KEY_API = '@fleet-mgmt/api-key';
    readonly STORAGE_KEY_FLEET_IDS = '@fleet-mgmt/fleet-ids';
    readonly STORAGE_KEY_FLEET_IMO_LOOKUP = '@fleet-mgmt/fleet-imo-lookup';

    // API Key - Settings
    saveApiKeySettings(apiKey: string): void {
        localStorage.setItem(this.STORAGE_KEY_API, apiKey); // JSON.stringify(myDataObject));
        this.dataService.apiKey_settings = apiKey;
    }

    getApiKeySettings(): string {
        const storedData = localStorage.getItem(this.STORAGE_KEY_API);
        this.dataService.apiKey_settings = storedData ? storedData : '';
        return this.dataService.apiKey_settings
    }


    // Fleet IDs - Settings
    saveFleetIdsSettings(fleetIdsObjAry: FleetIDSettingsObj[]): void {
        localStorage.setItem(this.STORAGE_KEY_FLEET_IDS, JSON.stringify(fleetIdsObjAry));
        this.dataService.fleetFleetId_settingsAryObj = fleetIdsObjAry;
    }

    getFleetIdsSettings(): FleetIDSettingsObj[] {
        const storedData = localStorage.getItem(this.STORAGE_KEY_FLEET_IDS);
        this.dataService.fleetFleetId_settingsAryObj = storedData ? JSON.parse(storedData) : [];
        return this.dataService.fleetFleetId_settingsAryObj
    }

    // ---
    // Fleet Imo Lookup - IndexedDB implementation
    private initIndexedDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = (event) => {
                console.error('Error opening IndexedDB', event);
                reject('Error opening IndexedDB');
            };

            request.onsuccess = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    }

    private async openIndexedDb(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = (event) => {
                reject('Error opening IndexedDB');
            };

            request.onsuccess = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                resolve(db);
            };
        });
    }

    // Save to IndexedDB (browser storage)
    public async saveFleetImoLookupData(fleetimolookupdata: string): Promise<any> {

        try {
            const db = await this.openIndexedDb();
            const transaction = db.transaction(this.STORE_NAME, 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);

            // Update or create the record
            const result = await new Promise<IDBRequest>((resolve) => {
                const request = store.put({ id: 'fleetLookupData', content: fleetimolookupdata });
                resolve(request);
            });

            // Update in-memory data
            this.dataService.fleetImoLookupString = fleetimolookupdata;

            // Close the db connection
            db.close();

            return result;
        } catch (error) {
            console.error('Error saving to IndexedDB', error);
            // Fall back to memory storage if IndexedDB fails
            this.dataService.fleetImoLookupString = fleetimolookupdata;
            return Promise.resolve();
        }
    }

    public async getFleetImoLookupData(): Promise<string> {
        try {
            const db = await this.openIndexedDb();
            const transaction = db.transaction(this.STORE_NAME, 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);

            const data = await new Promise<any>((resolve, reject) => {
                const request = store.get('fleetLookupData');

                request.onsuccess = () => {
                    resolve(request.result ? request.result.content : '');
                };

                request.onerror = (event) => {
                    reject('Error reading from IndexedDB');
                };
            });

            // Close the db connection
            db.close();

            // Update in-memory data
            this.dataService.fleetImoLookupString = data;

            return data;
        } catch (error) {
            console.error('Error reading from IndexedDB', error);
            // Return the in-memory data as fallback
            return this.dataService.fleetImoLookupString;
        }
    }
}   