import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { concatAll } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ResetpasswordService } from 'src/app/services/resetpassword.service';
import { SigninService } from 'src/app/services/signin.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  LoginForm!: FormGroup;
  loading: boolean = false;
  forgetPassword: boolean = true;
  redirectPagestring: boolean = false;
  isLoading: boolean = false;


  constructor(private fb: FormBuilder,
    private service: SigninService,
    private snackBarService :SnackbarService,
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private resetPassword: ResetpasswordService

  ) { }

  ngOnInit(): void {
    
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      keepMeSignIn: [false]

    });

    if (this.auth.isLoggedIn()) {
    }

  }

  onSubmit() {
    if (this.LoginForm.valid) {
      this.signIn();
    } else {
    
      this.snackBarService.showSnackBar('Please fill in all required fields correctly.', 'custom-snackbar-error');
    
    }
  }

  signIn() {
    this.isLoading = true;
    this.loading = true;
    const loginData = this.LoginForm.value;
    this.service.adminLogging(loginData).subscribe(
      (response) => {
        if (response.data != null) {
          this.isLoading = false;
          localStorage.setItem("token", response.data.token);
          localStorage.setItem('UserData', JSON.stringify(response.data));
        
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
          this.snackBarService.showSnackBar(response.message, 'custom-snackbar-success');
        } else {
          this.isLoading = false;
          this.snackBarService.showSnackBar(response.message, 'custom-snackbar-error');

        }
      },
      (error) => {
        this.snackBarService.showSnackBar('Internal server error', 'custom-snackbar-error');
        this.isLoading = false;
        // Handle error
      }
    );
  }
  restorePassword() {
    this.forgetPassword = false;
  }
  reset() {
    this.isLoading = true;
    const email = {
      email: this.LoginForm.get('email')?.value
    }
  
      this.resetPassword.forgetPassword(email).subscribe(
        (data: any) => {
          this.isLoading = false;
          if (data.statusCode !== 404) {
            this.redirectPagestring = true;
            this.snackBarService.showSnackBar(data.message, 'custom-snackbar-success');
          }
          else if(data.statusCode == 500)  
          {
            this.snackBarService.showSnackBar("Something went wrong , please try after sometime", 'custom-snackbar-error');
          }
          else {
            this.snackBarService.showSnackBar(data.message, 'custom-snackbar-error');
          }
        },
        (error) => {
          this.isLoading = false;
          this.snackBarService.showSnackBar('An error occurred. Please try again later.', 'custom-snackbar-error');
        }
      );
    }
  }
