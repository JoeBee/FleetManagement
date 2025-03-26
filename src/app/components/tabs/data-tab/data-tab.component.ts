import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { StatusProcessor } from '../../../services/status-processor.service';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-data-tab',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButtonModule, MatExpansionModule, MatIconModule],
  templateUrl: './data-tab.component.html',
  styleUrls: ['./data-tab.component.css']
})
export class DataTabComponent {

  statusMessage = '';
  // imoRows: DataTabRowObj[] = [];
  imoRows: any[] = [];

  constructor(
    private dataService: DataService,
    private statusProcessor: StatusProcessor) {

    this.initializeImoRows();

    // this.imoRows = Array(this.dataService.MAX_IMO_COUNT).fill(null)
    //   .map((_, index) => ({
    //     rowNumber: index + 1,
    //     imo: '',
    //     fleet: '',
    //     response: '',
    //     urlEndPoint: '',
    //     result: ''  // Can be 'success', 'error', or empty string
    //   }));
    this.statusProcessor.statusUpdated.subscribe((message: string) => {
      this.statusMessage = this.statusMessage + '\n' + message;
    });
  }


  initializeImoRows() {
    this.imoRows = Array(this.dataService.MAX_IMO_COUNT).fill(null)
      .map((_, index) => ({
        rowNumber: index + 1,
        imo: '',
      }));
  }

  getImoCount(): number {
    return this.imoRows.filter(row => row.imo.trim() !== '').length;
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const lines = pastedData.split('\n');

    // Get the current row number from the event target
    const input = event.target as HTMLInputElement;
    const currentRowNumber = parseInt(input.closest('tr')?.querySelector('td')?.textContent || '1') - 1;

    lines.forEach((line, index) => {
      const targetIndex = currentRowNumber + index;
      if (targetIndex < this.imoRows.length) {
        const digits = line.trim().replace(/\D/g, '');  // Remove non-digits
        this.imoRows[targetIndex].imo = digits.substring(0, 7);  // Limit to 7 characters
      }
    });
    this.updateImoTableData();
  }

  onImoInput(event: Event, row: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');  // Remove non-digits (should be none as these are limited to digits)
    row.imo = input.value.substring(0, 7);  // Limit to 7 characters
    this.updateImoTableData();
  }

  private updateImoTableData() {
    this.dataService.updateImoDataCols(
      this.imoRows.filter(row => row.imo.trim() !== ''));
  }

  refreshData() {
    // this.updateImoTableData();
  }

  removeSuccessful() {
    // Filter out rows where result indicates success
    /*
    fleet: "Fleet 6 (2878621)"
    imo: "9401960"
    response: "FLEET ITEM UPDATED"
    result: "success"
    rowNumber: 1
    urlEndPoint: "https://services.marinetraffic.com/api/setfleet//

    */
    let tempImoRows = this.imoRows
      .filter(
        row => !row.result?.includes('success')
          && row.imo != '');

    this.initializeImoRows(); // Reset the imoRows array to its original state
    console.log('**  *************** rownum??? tempImoRows =', tempImoRows);
    tempImoRows.forEach((row, index) => {
      row.rowNumber = index + 1;
      this.imoRows[index] = row;
    });

    // this.imoRows = tempImoRows;
    this.dataService.imosAry = this.imoRows
      .filter(row => row.imo != '')
      .map(row => row.imo);
    console.log('** this.dataService.imosAry =', this.dataService.imosAry);
  }

  resetGrid() {
    this.initializeImoRows();

    // // Create a single empty row as the initial state
    // this.imoRows = [{
    //   rowNumber: 1,
    //   imo: '',
    //   result: '',
    //   fleet: '',
    //   response: '',
    //   urlEndPoint: ''
    // }];

    // Clear the status message
    this.statusMessage = '';
  }
}
