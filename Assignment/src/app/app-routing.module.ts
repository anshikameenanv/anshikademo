import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DealershipDetailComponent } from './dealership-detail/dealership-detail.component';
import { DealrshipComponent } from 'src/dealrship/dealrship.component';

const routes: Routes = [
  { path: '', component: DealrshipComponent },
  { path: 'dealerships/:id', component: DealershipDetailComponent },
  // Add more routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}