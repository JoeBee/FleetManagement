import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DataPersistenceService } from './data-persistence.service';

@Injectable({
    providedIn: 'root'
})
export class AppInitializerService {

    constructor(
        private dataService: DataService,
        private dataPersistence: DataPersistenceService
    ) { }

    /**
     * Initialize the application data from localStorage
     * This will be called before the app is bootstrapped
     */
    initializeApp(): Promise<void> {
        console.log('Initializing app data...');

        return new Promise<void>(async (resolve) => {
            try {
                // Load API key from localStorage
                const apiKey = this.dataPersistence.getApiKeySettings();
                this.dataService._apiKey_settings = apiKey;

                // Load fleet IDs from localStorage
                const fleetIds = this.dataPersistence.getFleetIdsSettings();
                this.dataService._fleetFleetId_settingsAryObj = fleetIds;

                // Load fleetImoLookup data from IndexedDB
                try {
                    const fleetLookupData = await this.dataPersistence.getFleetImoLookupData();
                    if (fleetLookupData) {
                        this.dataService._fleetImoLookupString = fleetLookupData;
                        // TODO: Parse the string into FleetImoLookupObj[] if needed
                    }
                } catch (error) {
                    console.error('Error loading fleetImoLookupData from IndexedDB', error);
                }

                resolve();
            } catch (error) {
                console.error('Error during app initialization', error);
                // Still resolve to allow the app to start even if there was an error
                resolve();
            }
        });
    }
} 