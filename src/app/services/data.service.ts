import { Injectable } from '@angular/core';

export interface DataTabRowObj {
    rowNumber: number;
    imo: string;
    fleet: string;
    result: string;
    urlEndPoint: string;
}


export interface FleetImoLookupObj {
    fleetNum: string;
    imo: string;
}

export interface FleetIDSettingsObj {
    fleetNum: string;
    fleetId: string;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private readonly ROOT_URL = "https://services.marinetraffic.com/api/setfleet/";

    public _imosAry: any[] = []; // Data Tab, IMO column only
    public _imoDataColumnsAryObj: DataTabRowObj[] = []; // Data Tab, all columns

    // public _fleetImoLookupAryObj: FleetImoLookupObj[] = []; // Fleet Lookup Tab
    public _fleetImoLookupString: string = ''; // Fleet Lookup Tab

    public _apiKey_settings: string = ''; // Settings Tab, Top row
    public _fleetFleetId_settingsAryObj: FleetIDSettingsObj[] = []; // Settings Tab, Fleet IDs (5 rows, 2 cols)

    constructor() {
    }




    // -----------------------------------------`

    // Data Tab
    updateImoDataCols(imoDataColumns: DataTabRowObj[]) {
        this._imosAry = imoDataColumns.map(x => x.imo);
        this._imoDataColumnsAryObj = imoDataColumns;
    }

    // // -----------------------------------------`
    // // *** Long Term Data Storage

    // readonly SETTINGS_API_KEY = 'HiMarineCompanyApiKey';
    // readonly SETTINGS_FLEET_IDS = 'HiMarineCompanyFleetIds';
    // // NEW localStorage preferred instead of cookies
    // saveApiKeySettings(apiKey: string): void {
    //     localStorage.setItem(this.SETTINGS_API_KEY, apiKey); // JSON.stringify(myDataObject));
    //     this._apiKey_settings = apiKey;
    //     console.log('** ==> saveApiKeySettings', apiKey);
    // }

    // saveFleetIdsSettings(fleetIdsObjAry: fleetData): void {
    //     console.log('** ==> saveFleetIdsSettings', fleetIdsObjAry);
    //     console.log('** ==> saveFleetIdsSettings', JSON.stringify(fleetIdsObjAry));
    //     // TODO localStorage.setItem(this.SETTINGS_FLEET_IDS, JSON.stringify(fleetIdsObjAry));
    //     // TODO this._fleetFleetId_settingsAryObj = fleetIdsObjAry;
    // }

    // getApiKeySettings(): string {
    //     const storedData = localStorage.getItem(this.SETTINGS_API_KEY);
    //     this._apiKey_settings = storedData ? storedData : '';
    //     console.log('** ==> getApiKeySettings', this._apiKey_settings);
    //     return this._apiKey_settings
    // }

    // getFleetIdsSettings(): FleetIDSettingsObj[] {
    //     const storedData = localStorage.getItem(this.SETTINGS_FLEET_IDS);
    //     this._fleetFleetId_settingsAryObj = storedData ? JSON.parse(storedData) : [];
    //     return this._fleetFleetId_settingsAryObj
    // }

    // -----------------------------------------`

    getUrlEndPoint(imo: string, action: string, fleetId: string): string {
        return `${this.ROOT_URL}/${this._apiKey_settings}/imo:${imo}/${action}/fleet_id:${fleetId}`;
    }
}