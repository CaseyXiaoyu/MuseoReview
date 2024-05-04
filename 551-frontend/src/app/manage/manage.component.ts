import { Component } from '@angular/core';
import { MuseumService } from '../services/museum.service';
import { Museum } from '../models/museum.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent {
  displayInfo = false; // Controls the display of museum info
  manageSearchTerm: string = '';
  museums: Museum[] = [];
  constructor(
    private museumService: MuseumService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.museumService.getAllMuseums().subscribe(data => {
      this.museums = data;
      console.log(this.museums);
      this.displayInfo = true;
      this.displayMuseumInfo();
    });
  }

  setManageSearchTerm(term: string): void {
    sessionStorage.setItem('manageSearchTerm', term);
  }
  
  getManageSearchTerm(): string | null {
    return sessionStorage.getItem('manageSearchTerm');
  }
  

  toggleDialog(museum: Museum, state: boolean): void {
    museum.showDialog = state;
  }

  onSearch(manageSearchTerm: string) {
    console.log(manageSearchTerm);
    this.setManageSearchTerm(manageSearchTerm);
    this.museumService.getMuseumInfo(manageSearchTerm).subscribe(
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
  
  deleteMuseum(museum: Museum) {
    console.log('Deleting museum:', museum.id);
    this.toggleDialog(museum, false)
    this.museumService.deleteMuseum(museum.id).subscribe({
      next: (response: any) => {
        console.log('Museum deleted successfully', response);
        this.snackBar.open('Museum deleted successfully', 'Close', {
          duration: 3000
        });
        setTimeout(() => {
          this.displayInfo = true;
          const manageSearchTerm = this.getManageSearchTerm();
          this.onSearch(this.manageSearchTerm);
          console.log('Reloading data');
        }, 100);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to delete museum', error.message);
        this.snackBar.open('Failed to delete museum', 'Close', {
          duration: 3000
        });
        setTimeout(() => {
          this.displayInfo = true;
          const manageSearchTerm = this.getManageSearchTerm();
          this.onSearch(this.manageSearchTerm);
          console.log('Reloading data');
        }, 100);
      }
    });
  }

  navigateToUpdatePage(path: string, museumId: string): void {
    console.log('Navigating to:', path, museumId);
    this.router.navigate([path, museumId]);
  }
  navigateToPage(path: string): void {
    this.router.navigate([path]);
  }
}

