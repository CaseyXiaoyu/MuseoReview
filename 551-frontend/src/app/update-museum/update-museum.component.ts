import { Component } from '@angular/core';
import { Museum, MuseumAdd} from '../models/museum.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MuseumService } from '../services/museum.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-update-museum',
  templateUrl: './update-museum.component.html',
  styleUrls: ['./update-museum.component.css']
})
export class UpdateMuseumComponent {
museumId: string = '';
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

museumUpdated: Museum = {
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
  private router: Router,
  private route: ActivatedRoute

) {}

ngOnInit() {
  this.museumId = this.route.snapshot.paramMap.get('id')!;
  console.log(this.museumId);
  if (this.museumId !== null) {
    this.museumService.fetchMesuem(this.museumId).subscribe(data => {
      console.log(data);
      this.museum = data;
      this.museumUpdated = data; 
      console.log("debugging");
      console.log(this.museum);
      console.log(this.museumUpdated);
    });
  } else {
    console.error('No museum ID provided or museum ID is invalid');
  }
}

updateMuseum(museumUpdated: MuseumAdd, form: NgForm): void {
  // if museumUpdated.MuseumName == '' {museumUpdated.}
  this.museumService.updateMuseum(this.museumId, museumUpdated).subscribe(
    data => {
      console.log(data);
      this.snackBar.open('Museum updated successfully', 'Close', {
        duration: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    error => {
      console.error('There was an error!', error);
      this.snackBar.open('Error updating museum', 'Close', {
        duration: 3000,
      });
    }
  );
}

navigateToPage(path: string): void {
  this.router.navigate([path]);
}

}
