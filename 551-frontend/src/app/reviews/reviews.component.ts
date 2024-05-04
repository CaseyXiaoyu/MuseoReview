import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MuseumService } from '../services/museum.service';
import { Museum, MuseumAdd,addReview, Review } from '../models/museum.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit{
  museum: Museum = {
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
  reviews: any[] = [];
  reviewAdd : addReview = { comment: '', rating: 5 };
  museumId: string = '';


  constructor(
    private museumService: MuseumService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.museumId = this.route.snapshot.paramMap.get('id')!;
    console.log('Museum ID:', this.museumId);
    console.log(this.museumId);
    if (this.museumId !== null) {
      this.museumService.getMuseumDetails(this.museumId).subscribe(data => {
        console.log(data);
        this.museum.MuseumName = data.MuseumName;
        this.museum.Location = data.Location;
        this.museum.PhoneNum = data.PhoneNum;
        this.museum.Description = data.Description;
        this.museum.Fee = data.Fee;
        this.museum.LengthOfVisit = data.LengthOfVisit;
        this.museum.AverageRating = data.AverageRating;
        this.museum.ReviewCount = data.ReviewCount;
        console.log("REVIEWS")
        console.log(data.reviews);
        this.reviews = data.reviews;
        this.reviews.forEach(review => {
          review.showDialog = false;
        });
        console.log(this.museum);
        console.log(this.reviews);
      });    
    } else {
      console.error('No museum ID provided or museum ID is invalid');
    }
    
  }

  navigateToPage(path: string): void {
    this.router.navigate([path]);
  }

  addReview(reviewAdd: addReview): void {
    console.log('Add review');
    if (reviewAdd.comment && reviewAdd.rating) {
      this.museumService.addReview(this.museumId, reviewAdd).subscribe({
        next: (response) => {
          console.log("--------");
          console.log('Response:', response);
          this.snackBar.open('Review added successfully', 'Close', {
            duration: 3000
          });            
          setTimeout(() => {
            window.location.reload(); 
          }, 3000); 
        },
        error: (error) => {
          console.error('Failed to add review:', error);
          alert('Failed to add review');
        }
      });
    }
  }

  deleteComment(id: string): void {
    console.log('Delete comment');
    this.museumService.deleteReview(id).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.snackBar.open('Review deleted successfully', 'Close', {
          duration: 3000
        });             
        setTimeout(() => {
          window.location.reload(); 
        }, 3000); 
      },
      error: (error) => {
        console.error('Failed to delete review:', error);
        alert('Failed to delete review');
      }
    });
  }


  toggleDialog(review: Review, state: boolean): void {
    review.showDialog = state;
  }

  
}
