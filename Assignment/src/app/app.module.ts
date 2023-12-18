import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TopNavComponent } from 'src/top-nav/top-nav.component';
import { DealrshipComponent } from 'src/dealrship/dealrship.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AddDealerDialogComponent } from './add-dealer-dialog/add-dealer-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DealershipDetailComponent } from './dealership-detail/dealership-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { AddCarDialogComponent } from './add-car-dialog/add-car-dialog.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    DealrshipComponent,
    AddDealerDialogComponent,
    DealershipDetailComponent,
    AddCarDialogComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    AppRoutingModule,
    MatIconModule,         // Add MatIconModule
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
