import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public readonly ROUTES = AppRoutes;
  public menu = [
    {
      label: 'Home',
      routerLink: this.ROUTES.HOME,
    },
    {
      label: 'Settings',
      routerLink: this.ROUTES.SETTINGS,
    },
    {
      label: 'About',
      routerLink: this.ROUTES.ABOUT,
    },
    // {
    //   label: 'Help',
    //   routerLink: this.ROUTES.HELP,
    // },
  ];
}
