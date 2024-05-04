import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.css']
})
export class EntranceComponent {

  constructor(private router: Router) {}

  navigateToPage(path: string): void {
    this.router.navigate([path]);
  }
}
