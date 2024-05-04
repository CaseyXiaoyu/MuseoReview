import { Component } from '@angular/core';
import { MuseumService } from '../services/museum.service';
import { Museum } from '../models/museum.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  displayInfo = false; // Controls the display of museum info
  searchTerm: string = '';
  museums: Museum[] = [];
  constructor(
    private museumService: MuseumService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  onSearch(searchTerm: string) {
    console.log(searchTerm);
    this.museumService.getMuseumInfo(searchTerm).subscribe(
      data => {
        // Process your data here
        console.log(data);
        this.museums = data;
        this.displayInfo = true;
        this.displayMuseumInfo();
      },
      error => {
        // Handle error
        console.error('There was an error!', error);
        this.displayInfo = true;
        this.museums = [];
        this.displayMuseumInfo();
        this.noDataAlert();
      }
    );
  }

  displayMuseumInfo() {
    this.displayInfo = false;
    this.museums.forEach(museum => {
      // museum.reviews = museum.reviews.slice(0, 3);
    });
  }
  noDataAlert() {
    const element = document.getElementById('customAlert');
    if (element) {
      element.style.display = 'block';
    }
  }
  
  closeCustomAlert() {
    const element = document.getElementById('customAlert');
    if (element) {
      element.style.display = 'none';
    }
  }

  viewReviews(museum: Museum) {
    console.log(museum);
    // this.museumService.getMuseumReviews(museum.id).subscribe(
    //   data => {
    //     // Process your data here
    //     console.log(data);
    //     museum.reviews = data;
    //     this.displayInfo = true;
    //   },
    //   error => {
    //     // Handle error
    //     console.error('There was an error!', error);
    //     this.noDataAlert();
    //   }
    // );
  }

  navigateToPage(path: string): void {
    this.router.navigate([path]);
  }

  navigateToReviewsPage(path: string, museumId: string): void {
    this.router.navigate([path, museumId]);
  }
}

