import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../non-auth/pages/user/service/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html'
})
export class Login {
  form!: FormGroup;
  submitted = false;
  userNotFound = false;
  authError = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    // initialize form after fb is available
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.userNotFound = false;
    this.authError = '';

    if (this.form.invalid) return;

    // normalize possible undefined/null to empty string to satisfy strict types
    const email = (this.form.value.email ?? '').toString();
    const password = (this.form.value.password ?? '').toString();

    const user = this.userService.findByEmail(email);

    if (!user) {
      this.userNotFound = true;
      this.router.navigate(['/register'], { queryParams: { email } });
      return;
    }

    const auth = this.userService.authenticate(email, password);
    if (!auth) {
      this.authError = 'Invalid email or password.';
      return;
    }

    this.userService.setCurrent(auth);
    this.router.navigate(['/user']);
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  // toggle visibility of password input by id
  togglePassword(fieldId: string) {
    const input = document.getElementById(fieldId) as HTMLInputElement | null;
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
