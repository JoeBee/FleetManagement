import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { StatusProcessor } from '../../../services/status-processor.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
// import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-tab',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.css']
})
export class DashboardTabComponent implements OnInit {
  hasImos = false;
  hasFleetLookup = false;
  hasValidApiKey = false;
  hasValidFleetIds_settings = false;
  selectedAction: string = ''; //  Default value  // 'active:1';
  // pageLoadCount = -1; // Property to track if this is the first load

  inputData: any = {};
  settingsData: string = '';
  statusMessage: string = ''; // Property to hold status message

  constructor(private dataService: DataService,
    private statusProcessor: StatusProcessor) {
    console.log('** CONSTRUCTOR ==> DashboardTabComponent constructor');
    // This constructor is called only once, when the app is loaded
    // It is not called when the Dashboard Tab is loaded
    // Load in-memory data to be used throughout the application

    // Run when the app starts, otherwise runs upon tab change
    if (!this.hasValidApiKey) {
      this.refreshDashboard();
    }

    this.statusProcessor.statusUpdated.subscribe((message: string) => {
      // let safeHtml = this.sanitizer.bypassSecurityTrustHtml(message + this.statusMessage + '<br>');
      //this.statusMessage = message + this.statusMessage + '<br>';
      let msg = message + this.statusMessage + '<br>';
      this.statusMessage = msg;
    });
  }

  ngOnInit() { }

  async onSetStatuses() {
    const startTime = performance.now();
    const displayStartTime = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 2
    });

    let actionText = '';
    if (this.selectedAction === 'delete:1') {
      actionText = 'Remove Vessels From Fleet';
    } else if (this.selectedAction === 'active:0') {
      actionText = 'Make Vessels Inactive';
    } else if (this.selectedAction === 'active:1') {
      actionText = 'Activate Vessels';
    } else {
      actionText = this.selectedAction;
    }

    this.statusMessage = '<br>Start Processing - ' + displayStartTime + '<br>' + actionText + '<br>';
    await this.statusProcessor.processStatuses(this.selectedAction);

    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds with 2 decimal places

    const displayEndtime = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 2
    });
    this.statusProcessor.statusUpdated.emit(`Processing Complete ${displayEndtime}    (Elapsed: ${duration} seconds)<br><br>`);
  }


  // Code run when Dashboard Tab is loaded
  // Called from constructor as well as tabs.component -> onTabChanged
  refreshDashboard() {
    const hasImoData = this.dataService.imoDataColumnsAryObj && this.dataService.imoDataColumnsAryObj.length > 0;

    this.hasImos = hasImoData; // Data tab
    this.hasValidApiKey = !!this.dataService.apiKey_settings; // Settings tab
    this.hasFleetLookup = this.dataService.fleetImoLookupString.length > 0; // Fleet/IMO Lookup tab 
    this.hasValidFleetIds_settings = this.dataService.fleetFleetId_settingsAryObj.length > 4; // Settings tab
  }

}
