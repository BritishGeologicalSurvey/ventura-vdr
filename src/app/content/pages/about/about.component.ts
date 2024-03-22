import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  public component = AboutComponent;

  public static currentYear(): number {
    return new Date().getFullYear();
  }
}
