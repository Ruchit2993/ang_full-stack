import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {

  users: any[] =[] ;

  constructor(private router: Router, private userData: UserService) {
    this.userData.users().subscribe((data: any) => {
      this.users = data;
      // console.log(typeof(data))
      // console.log(data)
      // console.warn(this.users)
    })
    // console.warn(this.users)
  }
  delete(id: number) {}

  logout() {}

  addUser() {
    this.router.navigate(['/user-add-edit']);
  }
}
