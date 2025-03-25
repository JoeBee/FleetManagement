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

    public imosAry: any[] = []; // Data Tab, IMO column only
    public imoDataColumnsAryObj: DataTabRowObj[] = []; // Data Tab, all columns

    // public _fleetImoLookupAryObj: FleetImoLookupObj[] = []; // Fleet Lookup Tab
    public fleetImoLookupString: string = ''; // Fleet Lookup Tab

    public apiKey_settings: string = ''; // Settings Tab, Top row
    public fleetFleetId_settingsAryObj: FleetIDSettingsObj[] = []; // Settings Tab, Fleet IDs (5 rows, 2 cols)

    constructor() {
    }




    // -----------------------------------------`

    // Data Tab
    updateImoDataCols(imoDataColumns: DataTabRowObj[]) {
        this.imosAry = imoDataColumns.map(x => x.imo);
        this.imoDataColumnsAryObj = imoDataColumns;
    }

    // -----------------------------------------`

    getUrlEndPoint(imo: string, action: string, fleetId: string): string {
        return `${this.ROOT_URL}/${this.apiKey_settings}/imo:${imo}/${action}/fleet_id:${fleetId}`;
    }
}