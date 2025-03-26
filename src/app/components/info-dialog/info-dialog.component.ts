import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../services/data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export enum DialogType {
  FLEET_IMO_LOOKUP = 'fleetImoLookup',
  SETTINGS = 'settings',
  DATA = 'data',
  DASHBOARD = 'dashboard'
}

export interface InfoDialogData {
  type?: DialogType;
  title?: string;
  content?: string;
  showCloseButton?: boolean;
}

@Component({
  selector: 'app-info-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss'
})
export class InfoDialogComponent {
  title = signal('');
  content = signal<SafeHtml>('');
  showCloseButton = signal(true);

  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InfoDialogData,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {
    // console.log('* InfoDialogComponent constructor', data);


    // If direct title/content is provided, use that
    if (data.title && data.content) {
      this.title.set(data.title);
      this.content.set(this.sanitizer.bypassSecurityTrustHtml(data.content));
    }
    // Otherwise generate content based on dialog type
    else if (data.type) {
      let contentText = '';
      if (data.type === DialogType.FLEET_IMO_LOOKUP) {
        this.title.set('Fleet/IMO Lookup Information');
        contentText = `Date must be tab delimited. ie, pasted from Google sheets.\n\n`;
        contentText += `Paste your fleet/IMO data into the text area and click the "Save" button to save the data.\nExample:\n`;
        contentText += `fleet 2 9566708\n`;
        contentText += `fleet 1 1013688\n`;
        contentText += 'fleet 1 1014022\n';
        contentText += 'fleet 1 1014096\n';
        contentText += 'fleet 1 1014163\n';
        contentText += '...';
        contentText += '\n\n\n';
        contentText += 'This data will be saved to the user\'s browser and will persist across page reloads.';
        this.content.set(this.sanitizer.bypassSecurityTrustHtml(contentText));
      }
      else if (data.type === DialogType.SETTINGS) {
        this.title.set('Settings Information');
        contentText = '* API Key should be approx. 64 alpha/numeric characters.\n';
        contentText += '* Should be ~5 fleets in the fleet list. Each with a unique 7 character fleet ID.\n';
        contentText += '\n\n\n';
        contentText += 'Settings are saved to browser storage and will persist across page reloads.';
        this.content.set(this.sanitizer.bypassSecurityTrustHtml(contentText));
      }
      else if (data.type === DialogType.DATA) {
        this.title.set('Data Information');
        contentText += 'Enter "to be processed" IMOs here. ';
        contentText += '\n';
        contentText += `Maximum ${this.dataService.MAX_IMO_COUNT} IMOs.`;
        contentText += '\n';
        contentText += 'The rest of the columns will be populated automatically upon running the app.';
        contentText += '\n\n';
        contentText += '<span style="color: red;">Warnings:</span>\n';
        contentText += '<span style="color: red;">- "Remove Successful" will remove all successful results from the data table. there is no undo.\n</span>';
        contentText += '<span style="color: red;">- "Reset Grid" will clear all data from the data table. there is no undo.\n</span>';
        this.content.set(this.sanitizer.bypassSecurityTrustHtml(contentText));
      }
      else if (data.type === DialogType.DASHBOARD) {
        this.title.set('Fleet Management Information');
        contentText += '1. Settings Tab - Set API key and Fleet IDs (Usuallyl 5 fleets).';
        contentText += '\n';
        contentText += '2. Fleet/IMO Lookup Tab - Paste Fleet/IMO lookup data from Google sheets. Approximately 21,000 rows. MUST be tab delimited fields after pasting (Google sheet naturally puts tabs between fields when copy/pasting).';
        contentText += '\n';
        contentText += '3. Data Tab - Enter the IMOs you want to process.';
        contentText += '\n';
        contentText += '4. Dashboard Tab - Select "Action" and click "Set Statuses" to process the data.';
        contentText += '\n\n';
        contentText += 'Results can be viewed on the Data Tab.';
        this.content.set(this.sanitizer.bypassSecurityTrustHtml(contentText));
      }
      else {
        this.content.set(this.sanitizer.bypassSecurityTrustHtml('This is the default dialog'));
        this.title.set('Information');
      }
    }
    else {
      // Default values if neither type nor title/content is provided
      this.title.set('Information');
      this.content.set(this.sanitizer.bypassSecurityTrustHtml('No information available.'));
    }

    this.showCloseButton.set(data.showCloseButton !== undefined ? data.showCloseButton : true);
  }

  close(): void {
    this.dialogRef.close();
  }
}
