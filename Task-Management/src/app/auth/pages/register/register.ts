import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../non-auth/pages/user/service/user.service';
import { Auth } from '../../services/auth/auth';

const passwordMatchValidator: ValidatorFn = (ctrl: AbstractControl) => {
  const pw = ctrl.get('password')?.value;
  const cpw = ctrl.get('confirmPassword')?.value;
  return pw === cpw ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
form!: FormGroup;
  submitted = false;

  // hobbyOptions = ['Reading', 'Sports', 'Music', 'Travel'];
  // countries = ['India', 'USA', 'UK', 'Canada'];

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute, private auth: Auth) {
    // init form after fb injection; hobbies is a FormArray of booleans
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // mobile: ['', [Validators.required]],
      // country: ['', Validators.required],
      // gender: ['', Validators.required],
      // hobbies: this.fb.array(this.hobbyOptions.map(() => false)),
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  get f() { return this.form.controls; }
  // get hobbiesFA() { return this.form.get('hobbies') as FormArray; }

  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) this.form.patchValue({ email });
  }

  onSubmit() {
    console.log("///")
    this.submitted = true;
    if (this.form.invalid) return;

    const fv = this.form.value;
    console.log(fv,'fv')
    const name = (fv.name ?? '').toString();
    const lastName = (fv.lastName ?? '').toString();
    const email = (fv.email ?? '').toString();
    // const mobile = (fv.mobile ?? '').toString();
    // const country = (fv.country ?? '').toString();
    // const gender = (fv.gender ?? '').toString();
    const password = (fv.password ?? '').toString();

    // const selectedHobbies = this.hobbyOptions.filter((h, i) => !!this.hobbiesFA.at(i).value);

    // Try to register via backend first
    this.auth.register({ name, email, contact: undefined, password }).subscribe({
      next: (res) => {
        // backend may return created user object, or some wrapper; try to find user
        const created = (res && (res.user ?? res.data ?? res)) || { name, lastName, email };
        // persist to local storage service for UI consistency
        // try { this.userService.add(created as any); } catch {}
        // this.userService.setCurrent(created as any);
        this.router.navigate(['/user-list']);
      },
      error: (err) => {
        console.error('Register API failed', err);
        // fall back to local storage behavior
        // if (this.userService.findByEmail(email)) {
          // user exists
          // this.router.navigate(['/login']);
          // return;
        // }
        // const newUser = this.userService.add({ name, lastName, email, password });
        // this.userService.setCurrent(newUser);
        this.router.navigate(['/user-list']);
      }
    });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  togglePassword(fieldId: string) {
    const input = document.getElementById(fieldId) as HTMLInputElement | null;
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
