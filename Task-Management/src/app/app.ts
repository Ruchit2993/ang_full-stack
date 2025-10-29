import { Component, OnDestroy, signal } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs';
import { Header } from './layout/component/header/header';
import { Footer } from './layout/component/footer/footer';
import { Sidebar } from './layout/component/sidebar/sidebar';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet ,Header, Footer, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  protected readonly title = signal('Task-Management');
  year = new Date().getFullYear();

  showLayout = false;
  private routerSub!: Subscription;

  constructor(private router: Router /*, other injections if any */) {
    // set initial visibility and subscribe to navigation events
    this.updateLayoutVisibility(router.url);
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.updateLayoutVisibility(e.urlAfterRedirects ?? e.url));
  }

  private updateLayoutVisibility(url: string) {
    const path = (url || '').split('?')[0].replace(/^\/+/, '');
    // hide header/footer on login and register routes (and empty root redirect)
    this.showLayout = !!path && !['login', 'register'].includes(path);
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }
}
