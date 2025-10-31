import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

const passwordMatchValidator: ValidatorFn = (ctrl: AbstractControl) => {
  const pw = ctrl.get('password')?.value;
  const cpw = ctrl.get('confirmPassword')?.value;
  return pw === cpw ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-user-add-edit',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './user-add-edit.html',
  styleUrl: './user-add-edit.css',
})
export class UserAddEdit {
  userForm: FormGroup;
  submitted = false;

  hobbyOptions = ['Reading', 'Sports', 'Music', 'Travel'];
  countries = ['India', 'USA', 'UK', 'Canada'];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      country: ['', Validators.required],
      gender: ['', Validators.required],
      hobbies: this.fb.array(this.hobbyOptions.map(() => false)),
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: passwordMatchValidator });
  }

  get f() {
    return this.userForm.controls;
  }
  get hobbiesFA() { return this.userForm.get('hobbies') as FormArray; }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const fv = this.userForm.value;
    const selectedHobbies = this.hobbyOptions.filter((_, i) => fv.hobbies && fv.hobbies[i]);

    const key = 'app_users';
    // Read existing users safely
    let existing: any[] = [];
    try {
      const existingJson = localStorage.getItem(key) || '[]';
      const parsed = JSON.parse(existingJson);
      existing = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      // If parse fails, reset to empty array (we'll overwrite)
      existing = [];
      console.warn('Could not parse existing app_users from localStorage, starting fresh.', err);
    }

    // Compute next numeric id robustly
    const maxId = existing.reduce((max, u) => {
      // try to coerce id to a number; ignore non-numeric ids
      const idNum = Number(u?.id);
      if (!Number.isFinite(idNum) || Number.isNaN(idNum)) return max;
      return Math.max(max, idNum);
    }, 0);
    const nextId = maxId > 0 ? maxId + 1 : 1;

    const newUser = {
      id: nextId,
      name: fv.name,
      lastName: fv.lastName,
      email: fv.email,
      mobile: fv.mobile,
      country: fv.country,
      gender: fv.gender,
      hobbies: selectedHobbies,
      // store password if you need it (consider hashing in real apps)
      password: fv.password,
      createdAt: new Date().toISOString(),
    } as any;

    // Append & save
    try {
      existing.push(newUser);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save user to localStorage', err);
      alert('Could not save user locally. See console for details.');
      return;
    }

    console.log('User Added:', newUser);

    // Reset form and clear hobbies checkboxes
    this.userForm.reset();
    // reset hobbies to false array
    this.hobbiesFA.controls.forEach(ctrl => ctrl.setValue(false));

    // navigate back to users list
    this.router.navigate(['/user-list']);
  }

  goUsers() {
    this.router.navigate(['/user-list'])
  }

  togglePassword(fieldId: string) {
    const input = document.getElementById(fieldId) as HTMLInputElement | null;
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
