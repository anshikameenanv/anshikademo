import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SigninService } from 'src/app/services/signin.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],

})
export class SignUpComponent {
  signUpForm!: FormGroup;
  isloading: boolean = false;

  constructor(private formBuilder: FormBuilder, private snackBarService: SnackbarService, private service: SigninService, private snackBar: MatSnackBar, private router: Router) { }
  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      telephone: ['22222222222'],
      gender: ['Male', Validators.required],
      dateOfBirth: ['', Validators.required],
      isDeleted: [false],
      userName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roleName: "Traveler"
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.isloading = true;
      const signData = this.signUpForm.value;
      this.service.signUp(signData).subscribe(
        (response) => {
          this.isloading = false;
          if (response.statusCode === 200) {
            // Automatically log in the user with the same credentials
            this.service.adminLogging({ email: signData.emailId, password: signData.password }).subscribe(
              (loginResponse) => {
                this.snackBarService.showSnackBar('Signup and login successful', 'custom-snackbar-success');
                localStorage.setItem("token", loginResponse.data.token);
                localStorage.setItem('UserData', JSON.stringify(loginResponse.data));
                this.router.navigate(['/']).then(() => {
                  window.location.reload();
                });
              },
              (loginError) => {
                this.snackBarService.showSnackBar('Login failed', 'custom-snackbar-error');
                console.error('Login failed', loginError);
              }
            );
          }
          else if (response.statusCode === 409) {
            this.snackBarService.showSnackBar('Email already exists', 'custom-snackbar-error');
          }
          else {
            const message = response && response.data && response.message ? response.message : 'Signup failed';
            this.snackBarService.showSnackBar(message, 'custom-snackbar-error');
          }
        },
        (error) => {
          this.isloading = false;
          this.snackBarService.showSnackBar('Signup failed', 'custom-snackbar-error');
          console.error('Signup failed', error);
        }
      );
    } else {
      this.snackBarService.showSnackBar("Please fill out the form correctly", 'custom-snackbar-error');
    }
  }

  formatPhoneNumber(value: string): string {
    const areaCode = value.slice(0, 3);
    const firstPart = value.slice(3, 6);
    const secondPart = value.slice(6, 10);
    let formattedValue = '';
    if (areaCode) {
      formattedValue += `(${areaCode})`;
    }
    if (firstPart) {
      formattedValue += ` ${firstPart}`;
    }
    if (secondPart) {
      formattedValue += `-${secondPart}`;
    }
    return formattedValue;
  }

  onPhoneNumberInput(event: any): void {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    const maxLength = 10;
    if (value.length > maxLength) {
      this.signUpForm.get('mobileNumber')?.setErrors(null);
      value = value.slice(0, maxLength);
    }
    const formattedValue = this.formatPhoneNumber(value);
    input.value = formattedValue;
  }


}
