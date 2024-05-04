import { Component } from '@angular/core';
import { Museum, MuseumAdd } from '../models/museum.model';
import { MuseumService } from '../services/museum.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-museum',
  templateUrl: './add-museum.component.html',
  styleUrls: ['./add-museum.component.css']
})

export class AddMuseumComponent {
  museumAdd: Museum = {
    id: '',
    MuseumName: '',
    Location: '',
    PhoneNum: '',
    Description: '',
    Fee: '',
    LengthOfVisit: '',
    AverageRating: 0,
    ReviewCount: 0
  };

  constructor(
    private museumService: MuseumService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  addNewMuseum(museumAdd: MuseumAdd, form: NgForm) { 
    console.log(museumAdd);
    this.museumService.addMuseum(this.museumAdd).subscribe({
      next: (response:any) => {
        console.log(response);
        this.snackBar.open('Museum added successfully', 'Close', {
          duration: 3000
        });   
        form.reset(); 
      },
      error: (error: HttpErrorResponse) => alert('Failed to add museum')
    });
  }

  navigateToPage(path: string): void {
    this.router.navigate([path]);
  }
}
