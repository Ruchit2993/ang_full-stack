import { Routes } from '@angular/router';
import { Login } from './auth/pages/login/login';
import { Register } from './auth/pages/register/register';
import { UserAddEdit } from './non-auth/pages/user/pages/user-add-edit/user-add-edit';
import { User } from './non-auth/pages/user/user';
import { UserList } from './non-auth/pages/user/pages/user-list/user-list';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'user-add-edit', component: UserAddEdit },
    { path: 'user', component: User},
    { path: 'user-list', component: UserList}
];
