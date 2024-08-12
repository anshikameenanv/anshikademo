import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  travelerForm!: FormGroup;
  travelers: any[] = [];
  personalInfoForm!: FormGroup;
  bookingHistory: any[] = [];
  userData: any = [];
  userId: any;
  constructor(private formBuilder: FormBuilder, private user: UserService, private snackBarService: SnackbarService) { }

  ngOnInit() {
    const userData = localStorage.getItem('UserData');
    if (userData) {
      const data = JSON.parse(userData);
      this.userId = data.id;
      this.user.getUser(this.userId).subscribe((data: any) => {
        if (data.statusCode == 200) {
          this.setData(data);
        }
      });
      this.user.getUserBookingDetails(this.userId).subscribe((data: any) => {
        if (data.statusCode == 200) {
          this.bookingHistory = data.data;
        }
      })
    }
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      gender: ['1', Validators.required], 
      userName: [''],
      dob: [null, Validators.required],
      countryCode: ['USA', Validators.required],
      mobileNumber: ['457 457 7580', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]]
    });
    this.travelerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      countryCode: ['USA', Validators.required],
      mobileNumber: ['457 457 7580', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: [null, Validators.required]
    });
  }

  private setData(data: any) {
    const userData = data.data;
    this.personalInfoForm.patchValue({
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: userData.gender,
      dob: new Date(userData.dateOfBirth),
      mobileNumber: userData.mobileNumber,
      emailAddress: userData.emailId,
      userName: userData.userName

    });
  }
  savePersonalInfo() {
    const updateData = {
      userName: this.personalInfoForm.get('userName')?.value,
      emailId: this.personalInfoForm.get('emailAddress')?.value,
      firstName: this.personalInfoForm.get('firstName')?.value,
      lastName: this.personalInfoForm.get('lastName')?.value,
      mobileNumber: this.personalInfoForm.get('mobileNumber')?.value,
      gender: this.personalInfoForm.get('gender')?.value,
      dateOfBirth: this.personalInfoForm.get('dob')?.value,
      telephone: ""
    }
    this.user.updateUser(this.userId, updateData).subscribe((data: any) => {
      if (data.data) {
        this.snackBarService.showSnackBar(data.message, 'custom-snackbar-success');
      }
      else {
        this.snackBarService.showSnackBar(data.message, 'custom-snackbar-error');
      }
    })
  }
}
