import { Component, Input, Renderer2, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDropdownOpen = false;
  selectedOption: string | null = null;
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  private unlistener: () => void;

  @Input() showLogOut: boolean = false;
  userName: any;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    public router: Router,
    private authService: AuthService
  ) {
    this.unlistener = this.renderer.listen('document', 'click', (event: Event) => {
      this.onDocumentClick(event);
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.showLogOut = true;
      const data = localStorage.getItem('UserData');
      if (data) {
        this.userName = JSON.parse(data).userName;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.unlistener) {
      this.unlistener();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  private onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    if (this.isDropdownOpen && !this.el.nativeElement.contains(targetElement)) {
      this.isDropdownOpen = false;
    }
  }

  signIn() {
    const currentUrl = this.router.url;
    if (currentUrl === '/signin') {
      this.router.navigateByUrl('/signup', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/signin']);
      });
    } else {
      this.router.navigate(['/signin']);
    }
  }

  logOut() {
    this.authService.logOut();
    this.showLogOut = false;
  }
}