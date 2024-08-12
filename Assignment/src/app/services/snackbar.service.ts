import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../components/custom-snack-bar/custom-snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  showSnackBar(message: string, panelClass: string = '', duration: number = 3000) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      duration: duration,
      data: { message: message, panelClass: panelClass, snackBarRef: this.snackBar },
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: panelClass
    });
  }
}
