import { Component,signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 
import { AuthService, AuthResponse } from './auth.service';

@Component({
	selector: 'app-auth',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './auth.html',
	styleUrl: './auth.css'
})
export class AuthComponent {
	mode: 'login' | 'signup' = 'login';

	loginData = {
		email: '',
		password: '',
	};
	signupData = {
		email: '',
		password: '',
		confirmPassword: '',
	};
	authResponse = signal<AuthResponse | null>(null);
	errorMessage = signal<string | null>(null);

	constructor(private authService: AuthService, 
		        private router: Router) { }

	toggleMode(): void {
		this.mode = this.mode === 'login' ? 'signup' : 'login';
		this.errorMessage.set(null);
		this.authResponse.set(null);
	}
	onSubmit(): void { 
		this.errorMessage.set(null);
		if (this.mode === 'login') {
			this.authService.login(this.loginData).subscribe({
				next: (response) => {
					this.authResponse.set(response);
					localStorage.setItem('token', response.token);  // Store token
					console.log('Login successful:', response);
					this.router.navigate(['/habit']);
				},
				error: (err) => {
					this.errorMessage.set('Login failed. Please try again.');
					console.error(err);
				},
			});
		} else {
			// Basic check: ensure password and confirmPassword match
			if (this.signupData.password !== this.signupData.confirmPassword) {
				this.errorMessage.set("Passwords don't match.");
				return;
			}
			this.authService.signup(this.signupData).subscribe({
				next: (response) => {
					this.authResponse.set(response);
					localStorage.setItem('token', response.token);  // the backend recognizes the user on future API calls thru tokens
					console.log('Signup successful:', response);
					this.router.navigate(['/habit']);
				},
				error: (err) => {
					this.errorMessage.set('Signup failed. Please try again.');
					console.error(err);
				},
			});
		}
	}
}



