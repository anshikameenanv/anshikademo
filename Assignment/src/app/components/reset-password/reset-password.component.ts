import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetpasswordService } from 'src/app/services/resetpassword.service';
import { SigninService } from 'src/app/services/signin.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  token: any;
  resetForm!: FormGroup;

  constructor(private route: ActivatedRoute, private snackBarService:SnackbarService,
    private formBuilder: FormBuilder, private resetPassword: ResetpasswordService, private snackBar: MatSnackBar, private router: Router, private service: SigninService) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
 
      this.token = window.location.href.split("&token=")[1].replaceAll("%20", "+").replaceAll("%2F", "/");
    });
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      token: ['']
    });
  }

  onSubmit() {
    if(this.resetForm.valid && (this.resetForm.get('confirmPassword')?.value == this.resetForm.get('password')?.value ) ){
      const resetData = {
        password: this.resetForm.get('password')?.value,
        confirmPassword: this.resetForm.get('confirmPassword')?.value,
        email: this.resetForm.get('email')?.value,
        token: this.token
      }
      this.resetPassword.resetPassword(resetData).subscribe((data: any) => {
        if (data.data != null) {
          const loginData = {
            email: this.resetForm.get('email')?.value,
            password: this.resetForm.get('password')?.value,
            keepMeSignIn: false
          }
          this.service.adminLogging(loginData).subscribe(
            (response) => {
              if (response.data != null) {
               
                localStorage.setItem("token", response.data.token);
                localStorage.setItem('UserData', JSON.stringify(response.data));
                this.snackBarService.showSnackBar(response.message, 'custom-snackbar-success');
                this.router.navigate(['/']).then(() => {
                  window.location.reload();
                });
              } else {
              
                this.snackBarService.showSnackBar(response.message, 'custom-snackbar-error');
              }
            },
            (error) => {
          
              this.snackBarService.showSnackBar(error, 'custom-snackbar-error');
            }
          );
        }
        else{
          this.snackBarService.showSnackBar(data.message, 'custom-snackbar-error');
        }
  
      })
    }
    else{
      this.snackBarService.showSnackBar("Passwords do not match ", 'custom-snackbar-error');
    }
 
  }
}
