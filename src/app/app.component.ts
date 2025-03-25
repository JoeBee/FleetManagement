import { Component, inject } from '@angular/core';
import { TabsComponent } from './components/tabs/tabs.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InfoDialogService } from './services/info-dialog.service';
import { DialogType } from './components/info-dialog/info-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TabsComponent, MatIconModule, MatButtonModule],
  template: `
    <div class="header">
      <h1>{{title}}</h1>
      <button mat-icon-button class="large-icon-button" (click)="openInfoDialog()">
        <mat-icon>info</mat-icon>
      </button>
    </div>
    <app-tabs #tabs (activeTabChange)="onActiveTabChange($event)"></app-tabs>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      padding: 0 16px;
    }
    h1 {
      flex: 1;
      margin: 0;
      padding: 16px 0;
      font-size: 24px;
      font-weight: normal;
      color: #333;
    }
    .large-icon-button {
      width: 48px;
      height: 48px;
      line-height: 48px;
    }
    .large-icon-button .mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      line-height: 36px;
    }
  `]
})
export class AppComponent {
  title = 'Fleet Management';
  activeTabIndex = 0;
  private infoDialogService = inject(InfoDialogService);

  onActiveTabChange(index: number) {
    this.activeTabIndex = index;
  }

  openInfoDialog() {
    let dialogType: DialogType;

    switch (this.activeTabIndex) {
      case 0:
        dialogType = DialogType.DASHBOARD;
        break;
      case 1:
        dialogType = DialogType.DATA;
        break;
      case 2:
        dialogType = DialogType.FLEET_IMO_LOOKUP;
        break;
      case 3:
        dialogType = DialogType.SETTINGS;
        break;
      default:
        dialogType = DialogType.DASHBOARD;
    }

    this.infoDialogService.openInfoDialog({ type: dialogType });
  }
}
