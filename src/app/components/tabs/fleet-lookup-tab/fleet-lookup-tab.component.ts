import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { DataPersistenceService } from '../../../services/data-persistence.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogType, InfoDialogComponent } from '../../info-dialog/info-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-fleet-lookup-tab',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule, // *ngIf
    MatProgressSpinnerModule, // mat-spinner
    MatButtonModule, // for the save button
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './fleet-lookup-tab.component.html',
  styleUrls: ['./fleet-lookup-tab.component.css']
})
export class FleetLookupTabComponent implements OnInit {
  isLoading: boolean = true;
  rowCount: number = 0;
  DialogType = DialogType; // Expose enum to the template

  // Reactive form
  fleetLookupForm = new FormGroup({
    fleetImoData: new FormControl('')
  });

  constructor(
    private dataService: DataService,
    private dataPersistence: DataPersistenceService
    // private dialog: MatDialog
  ) {
    console.log('** CONSTRUCTOR ==> FleetLookupTabComponent constructor');
  }

  ngOnInit() {
    this.refreshFleetLookup();
    // this.isLoading = true;

    // Subscribe to form value changes to update row count
    // this.fleetLookupForm.get('fleetImoData')?.valueChanges.subscribe(value => {
    // });
  }

  // Get the number of non-empty rows in the textarea
  getTextAreaRowCount(): number {
    const data = this.fleetLookupForm.get('fleetImoData')?.value || '';

    if (!data) {
      return 0;
    }

    const lines = data.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim() !== '');
    return nonEmptyLines.length;
  }

  // Format a number with commas
  formatNumberWithCommas(num: number): string {
    return num.toLocaleString();
  }

  // Explicit save button handler
  saveFleetLookupData() {
    this.isLoading = true;
    const fleetImoData = this.fleetLookupForm.get('fleetImoData')?.value || '';

    this.dataPersistence.saveFleetImoLookupData(fleetImoData)
      .then(() => {
        // this.updateFleetLookupCount();
      })
      .catch(error => {
        console.error('Error saving fleet lookup data', error);
      })
      .finally(() => {
        // Spinner shows for a minimum of 1 second for each 10,000 records
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
      });
  }

  // private updateFleetLookupCount() {
  //   const fleetImoData = this.fleetLookupForm.get('fleetImoData')?.value || '';

  //   // Parse the data and update the fleetImoLookupAryObj
  //   const nonEmptyLines = fleetImoData.split('\n')
  //     .filter(line => line.trim() !== '');

  //   // Update the dataService's _fleetImoLookupString directly
  //   // this.dataService._fleetImoLookupString = fleetImoData;
  // }

  refreshFleetLookup() {
    this.isLoading = true;

    const lineCount = this.dataService._fleetImoLookupString ?
      this.dataService._fleetImoLookupString.split('\n')
        .filter(line => line.trim() !== '').length : 0;

    this.fleetLookupForm.get('fleetImoData')?.setValue(
      this.dataService._fleetImoLookupString);

    setTimeout(() => {
      this.isLoading = false;
    }, 4000);
  }

}
