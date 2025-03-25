import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InfoDialogComponent, InfoDialogData, DialogType } from '../components/info-dialog/info-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class InfoDialogService {

  constructor(private dialog: MatDialog) { }

  /**
   * Opens an information dialog with the specified type
   * @param data The dialog data with type and optional parameters
   * @returns A reference to the dialog
   */
  openInfoDialog(data: InfoDialogData): MatDialogRef<InfoDialogComponent> {
    return this.dialog.open(InfoDialogComponent, {
      data,
      width: '450px',
      disableClose: !data.showCloseButton
    });
  }

  /**
   * Opens an information dialog with the specified title and content
   * @param title The dialog title
   * @param content The dialog content
   * @param showCloseButton Whether to show the close button (default: true)
   * @returns A reference to the dialog
   */
  openCustomInfoDialog(title: string, content: string, showCloseButton = true): MatDialogRef<InfoDialogComponent> {
    return this.dialog.open(InfoDialogComponent, {
      data: {
        title,
        content,
        showCloseButton
      } as any,
      width: '450px',
      disableClose: !showCloseButton
    });
  }
}
