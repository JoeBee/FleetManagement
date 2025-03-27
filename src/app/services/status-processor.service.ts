import { Injectable, EventEmitter } from '@angular/core';
import { DataService, FleetIDSettingsObj, FleetImoLookupObj } from './data.service';
// import { DomSanitizer } from '@angular/platform-browser';

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
        const imosAry: string[] = this.dataService.imosAry;

        // ** Fleet/IMO Lookup Tab **
        let fleetImoLookupAry: FleetImoLookupObj[] = [];
        const fleetImoLookupString = this.dataService.fleetImoLookupString
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
            this.dataService.fleetFleetId_settingsAryObj;

        const dataColumns = this.dataService.imoDataColumnsAryObj;


        // Loop over each fleetImoLookup object to update with fleetId
        let statusMessageString = '';
        let loopCount = 0;
        for (const fleetImoObj of imoFleetObjAry) {
            loopCount++;
            statusMessageString = '';
            statusMessageString += `${loopCount}/${imoFleetObjAry.length}. IMO ${fleetImoObj.imo}`;
            const fleetidObj: FleetIDSettingsObj | undefined = fleetFleetIdSettingsObjAry.find(x => x.fleetNum === fleetImoObj.CALCULATED_fleetNum);
            const dataRow = dataColumns.find(row => row.rowNumber === loopCount);

            if (fleetidObj) {
                if (dataRow) {
                    dataRow.fleet = `Fleet ${fleetidObj.fleetNum} (${fleetidObj.fleetId})`;
                    const urlEndPoint = this.dataService.getUrlEndPoint(fleetImoObj.imo, selectedAction, fleetidObj.fleetId);

                    dataRow.urlEndPoint = urlEndPoint;

                    // Make HTTP request to urlEndPoint and handle XML response
                    const response = await fetch(urlEndPoint);
                    const xmlData = await response.text();
                    console.log('* response', response);
                    console.log('* xmlData', xmlData);

                    const apiMsg = this.parseXmlResponse(xmlData);
                    console.log('* apiMsg', apiMsg);
                    dataRow.result = apiMsg?.result || '';
                    if (apiMsg) {
                        dataRow.response = `${apiMsg.description}`;
                        // dataRow.result = apiMsg.result === 'success' ? '' : 'X';
                        statusMessageString += ` - ${apiMsg.description}`;
                    }
                    else {
                        dataRow.response = `${xmlData}`
                        statusMessageString += ` - ${xmlData}`;
                    }
                }
            }
            else {
                if (dataRow) {
                    dataRow.fleet = `<b>Fleet not found</b>`;
                    statusMessageString += ` - <B class="api-error">Fleet not found for IMO</B>`; // 'red' stripped out by sanitizer - TODO
                    dataRow.result = 'error';
                }
                else {
                    console.log(`<b>IMO Not found! ${fleetImoObj.imo} ???</b>`);
                    statusMessageString += ` - <B class="api-error" style="color: red;">IMO Not found! ${fleetImoObj.imo}</B>`; // 'red' stripped out by sanitizer - TODO
                }
            }

            this.statusUpdated.emit(statusMessageString + '<br>');
        }

        let finalStatusMessageString = `- Successes: ${dataColumns.filter(x => x.result === 'success').length}, 
        Errors: ${dataColumns.filter(x => x.result === 'error').length} - &nbsp;&nbsp;
        Total:${dataColumns.length}`;

        this.statusUpdated.emit(finalStatusMessageString + '<br><br>');
    }

    private parseXmlResponse(xmlData: string) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "text/xml");

        // Check for success response
        const successElement = xmlDoc.querySelector('SUCCESS');
        if (successElement) {
            const code = successElement.getAttribute('CODE');
            const description = successElement.getAttribute('DESCRIPTION');
            return {
                code: code || '',
                description: description || '',
                result: 'success'
            };
        }
        /*
        <RESPONSE>
            <STATUS>
                <SUCCESS CODE="s7" DESCRIPTION="FLEET ITEM UPDATED"/>
            </STATUS>
        </RESPONSE>
        */
        const errorElement = xmlDoc.querySelector('ERROR');
        if (errorElement) {
            const code = errorElement.getAttribute('CODE');
            const description = errorElement.getAttribute('DESCRIPTION');
            return {
                code: code || '',
                description: description || '',
                result: 'error'
            };
        }

        return null;
    }

}