import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DataService, FleetIDSettingsObj } from '../../../services/data.service';
import { DataPersistenceService } from '../../../services/data-persistence.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogType, InfoDialogComponent } from '../../../components/info-dialog/info-dialog.component';

@Component({
  selector: 'app-settings-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './settings-tab.component.html',
  styleUrls: ['./settings-tab.component.css']
})
export class SettingsTabComponent implements OnInit {
  // Form group for the settings
  settingsForm = new FormGroup({
    apiKey: new FormControl('', [Validators.minLength(12), Validators.required]),
    fleetId: new FormControl('', [Validators.required, Validators.pattern(/^\d{7}$/)])
  });

  // Array for storing individual fleet entries
  fleetFleetIdTxtAreaAry: FleetIDSettingsObj[] = [];

  // Track if fleet entries are dirty (have unsaved changes)
  fleetEntriesDirty: boolean = false;

  // Expose DialogType enum to the template
  DialogType = DialogType;

  constructor(
    private dataService: DataService,
    private dataPersistence: DataPersistenceService,
    private dialog: MatDialog
  ) {
    console.log('** CONSTRUCTOR ==> SettingsTabComponent constructor');
  }

  ngOnInit() {
    // this.refreshSettings();
  }

  // Check if API Key button should be enabled
  isApiKeySaveEnabled(): boolean {
    const apiKeyControl = this.settingsForm.get('apiKey');
    const apiKeyValue = apiKeyControl?.value || '';
    return apiKeyControl?.dirty === true && apiKeyValue.length >= 12;
  }


  // Handle the API Key save action
  saveApiKey() {
    if (this.settingsForm.get('apiKey')?.valid) {
      const apiKey = this.settingsForm.get('apiKey')?.value || '';
      this.dataPersistence.saveApiKeySettings(apiKey);
      const apiKeyControl = this.settingsForm.get('apiKey');
      apiKeyControl?.markAsPristine();
    }
  }

  // ------------------------

  // Add a new fleet entry
  addFleetEntry() {
    const fleetId = this.settingsForm.get('fleetId')?.value;
    if (fleetId && this.settingsForm.get('fleetId')?.valid) {
      const fleetNum = (this.fleetFleetIdTxtAreaAry.length + 1).toString();
      this.fleetFleetIdTxtAreaAry.push({ fleetNum, fleetId });
      this.fleetEntriesDirty = true;
      this.settingsForm.get('fleetId')?.reset();
    }
  }

  // Remove a fleet entry
  removeFleetEntry(index: number) {
    this.fleetFleetIdTxtAreaAry.splice(index, 1);
    this.fleetEntriesDirty = true;

    // Renumber the fleet entries
    this.fleetFleetIdTxtAreaAry.forEach((entry, idx) => {
      entry.fleetNum = (idx + 1).toString();
    });
  }

  // Check if Save Fleets button should be enabled
  isFleetsSaveEnabled(): boolean {
    return this.fleetEntriesDirty && this.fleetFleetIdTxtAreaAry.length > 0;
  }

  // Save fleet entries
  saveFleets() {
    console.log('** ==> saveFleets', this.fleetFleetIdTxtAreaAry);
    if (this.fleetFleetIdTxtAreaAry.length > 0) {
      this.dataPersistence.saveFleetIdsSettings(this.fleetFleetIdTxtAreaAry);
      this.fleetEntriesDirty = false;
    }
  }

  // Load settings from data service
  refreshSettings() {
    const apiKey = this.dataService._apiKey_settings;
    this.settingsForm.get('apiKey')?.setValue(apiKey);

    // Load fleet entries
    const fleetEntries = this.dataService._fleetFleetId_settingsAryObj;
    console.log('** ==> refreshSettings', fleetEntries);
    if (fleetEntries.length > 0) {
      this.fleetFleetIdTxtAreaAry = fleetEntries;
      this.fleetEntriesDirty = false;
    }
  }

  // Open info dialog
  // openInfoDialog(dialogType: DialogType): void {
  //   this.dialog.open(InfoDialogComponent, {
  //     width: '400px',
  //     data: { type: dialogType },
  //     disableClose: true,
  //     hasBackdrop: true
  //   });
  // }
}
