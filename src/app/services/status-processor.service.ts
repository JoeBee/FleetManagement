import { Injectable, EventEmitter } from '@angular/core';
import { DataService, FleetIDSettingsObj, FleetImoLookupObj } from './data.service';
import { DomSanitizer } from '@angular/platform-browser';

export interface imoFleetObj {
    imo: string; // Ship IMO number
    CALCULATED_fleetNum: string; // Fleet number (Ex: Fleet 3)
}

@Injectable({
    providedIn: 'root'
})
export class StatusProcessor {
    statusUpdated: EventEmitter<string> = new EventEmitter<string>(); // Create an EventEmitter as an instance property

    constructor(private dataService: DataService) { }

    async processStatuses(selectedAction: string) {

        // ** Data Tab - IMOs to be processed **
        const imosAry: string[] = this.dataService._imosAry;

        // ** Fleet/IMO Lookup Tab **
        let fleetImoLookupAry: FleetImoLookupObj[] = [];
        const fleetImoLookupString = this.dataService._fleetImoLookupString
            .toLowerCase()
            .replace(' ', '') // Remove all spaces
            .replace('fleet', '') // Replace multiple spaces with a single space
            .replace(/\t/g, '*'); // Replace tabs with '*'

        if (fleetImoLookupString) {
            const lines = fleetImoLookupString.split('\n');
            fleetImoLookupAry = lines.map(line => {
                const [fleetNum, imo] = line.trim().split('*');
                return { fleetNum, imo };
            });
        }

        // Merge IMOs with Fleet Numbers
        const imoFleetObjAry: imoFleetObj[] = imosAry.map(imo => {
            const fleetImoLookupObj = fleetImoLookupAry.find(x => x.imo === imo); // Ex: {fleetNum: 'fleet 3', imo: '3333332'}
            return {
                imo,
                CALCULATED_fleetNum: fleetImoLookupObj ? fleetImoLookupObj.fleetNum.trim().toLowerCase().replace('fleet ', '') : ''
            };
        });;


        const fleetFleetIdSettingsObjAry: FleetIDSettingsObj[] =
            this.dataService._fleetFleetId_settingsAryObj;

        const dataColumns = this.dataService._imoDataColumnsAryObj;


        // Loop over each fleetImoLookup object to update with fleetId
        let statusMessageString = '';
        let loopCount = 0;
        for (const fleetImoObj of imoFleetObjAry) {
            loopCount++;
            console.log('** ==> ', loopCount + '/' + imoFleetObjAry.length, fleetImoObj.CALCULATED_fleetNum, fleetImoObj.imo);
            statusMessageString = '';
            statusMessageString += `${loopCount}/${imoFleetObjAry.length}. IMO <b>${fleetImoObj.imo}</b>`;
            // this.statusUpdated.emit(`Processing IMO <b>${fleetImoObj.imo}</b> (${loopCount}/${imoFleetObjAry.length})<br>`);
            const fleetidObj: FleetIDSettingsObj | undefined = fleetFleetIdSettingsObjAry.find(x => x.fleetNum === fleetImoObj.CALCULATED_fleetNum);
            // const dataRow = dataColumns.find(row => row.imo === fleetImoObj.imo);
            const dataRow = dataColumns.find(row => row.rowNumber === loopCount);

            if (fleetidObj) {
                if (dataRow) {
                    dataRow.fleet = `Fleet ${fleetidObj.fleetNum} (${fleetidObj.fleetId})`;
                    const urlEndPoint = this.dataService.getUrlEndPoint(fleetImoObj.imo, selectedAction, fleetidObj.fleetId);

                    dataRow.urlEndPoint = urlEndPoint;
                    // statusMessageString += urlEndPoint + '<br>';
                    // this.statusUpdated.emit(statusMessageString);

                    // Make HTTP request to urlEndPoint and handle XML response
                    const response = await fetch(urlEndPoint);
                    const xmlData = await response.text();
                    console.log('*** xmlData', xmlData);


                    const error = this.parseXmlResponse(xmlData);
                    if (error) {
                        // dataRow.result = `${error.code}: ${error.description}`;
                        dataRow.result = `${error.description}`;
                        statusMessageString += ` - <B class="api-error" style="color: red;">${error.description}</B>`; // 'red' stripped out by sanitizer - TODO
                    }

                    else {
                        dataRow.result = `${xmlData}`
                        statusMessageString += ` - ${xmlData}`;
                        // Emit the XML data to be displayed in the right column
                        // this.dashboardService.updateRightColumnContent(xmlData);
                    }
                }
            }
            else {
                if (dataRow) {
                    dataRow.fleet = `<b>Fleet not found</b>`;
                    statusMessageString += ` - <B class="api-error" style="color: red;">Fleet not found for IMO</B>`; // 'red' stripped out by sanitizer - TODO
                }
                else {
                    console.log(`<b>*** IMO Not found! ${fleetImoObj.imo} ???</b>`);
                    statusMessageString += ` - <B class="api-error" style="color: red;">IMO Not found! ${fleetImoObj.imo}</B>`; // 'red' stripped out by sanitizer - TODO
                }
            }

            this.statusUpdated.emit(statusMessageString + '<br>');
        }
    }

    private parseXmlResponse(xmlData: string) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "text/xml");

        const errorElement = xmlDoc.querySelector('ERROR');
        if (errorElement) {
            const code = errorElement.getAttribute('CODE');
            const description = errorElement.getAttribute('DESCRIPTION');
            return {
                code: code || '',
                description: description || ''
            };
        }

        return null;
    }

}