import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bank-system';
  currentTab = window.location.pathname === '/' ? 'countries' : (window.location.pathname.includes('countries') ? 'countries' : 'indicators');

  setTab(name: string) {
    this.currentTab = name;
  }
}
