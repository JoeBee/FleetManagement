import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { DashboardTabComponent } from './dashboard-tab/dashboard-tab.component';
import { DataTabComponent } from './data-tab/data-tab.component';
import { FleetLookupTabComponent } from './fleet-lookup-tab/fleet-lookup-tab.component';
import { SettingsTabComponent } from './settings-tab/settings-tab.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    DashboardTabComponent,
    DataTabComponent,
    FleetLookupTabComponent,
    SettingsTabComponent,
  ],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent {
  @ViewChild('dashboardTab') dashboardTab!: DashboardTabComponent;
  @ViewChild('dataTab') dataTab!: DataTabComponent;
  @ViewChild('fleetLookupTab') fleetLookupTab!: FleetLookupTabComponent;
  @ViewChild('settingsTab') settingsTab!: SettingsTabComponent;
  @Output() activeTabChange = new EventEmitter<number>();

  onTabChanged(index: number) {
    this.activeTabChange.emit(index);

    setTimeout(() => {
      if (index === 0) { // Dashboard tab index
        this.dashboardTab.refreshDashboard();
      }
      else if (index === 1) { // Data tab index
        this.dataTab.refreshData();
      }
      else if (index === 2) { // Fleet Lookup tab index
        this.fleetLookupTab.refreshFleetLookup();
      }
      else if (index === 3) { // Settings tab index
        this.settingsTab.refreshSettings();
      }
      else {
        console.log('ERROR: onTabChanged', index);
      }
    });
  }
}