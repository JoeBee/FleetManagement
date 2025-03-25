import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { StatusProcessor } from '../../../services/status-processor.service';

@Component({
  selector: 'app-data-tab',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './data-tab.component.html',
  styleUrls: ['./data-tab.component.css']
})
export class DataTabComponent {
  rows = Array(1000).fill(null).map((_, index) => ({
    rowNumber: index + 1,
    imo: '',
    fleet: '',
    result: '',
    urlEndPoint: ''
  }));

  statusMessage = '';

  constructor(private dataService: DataService, private statusProcessor: StatusProcessor) {
    console.log('** CONSTRUCTOR ==> DataTabComponent constructor');
    this.statusProcessor.statusUpdated.subscribe((message: string) => {
      this.statusMessage = this.statusMessage + '\n' + message;
    });
  }

  getImoCount(): number {
    return this.rows.filter(row => row.imo.trim() !== '').length;
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const lines = pastedData.split('\n');

    lines.forEach((line, index) => {
      if (index < this.rows.length) {
        const digits = line.trim().replace(/\D/g, '');  // Remove non-digits
        this.rows[index].imo = digits.substring(0, 7);  // Limit to 7 characters
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
    // const count = this.rows.filter(row => row.imo.trim() !== '').length;
    // this.dataService.updateImoCount(count);
    this.dataService.updateImoDataCols(
      this.rows.filter(row => row.imo.trim() !== ''));

  }

  refreshData() {
    // this.updateImoTableData();
  }
}
