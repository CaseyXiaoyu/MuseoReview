import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Museum, MuseumAdd, addReview } from '../models/museum.model'; // Adjust path as needed

@Injectable({
  providedIn: 'root'
})

export class MuseumService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://127.0.0.1:5000'
  

  getMuseumInfo(searchTerm: string): Observable<any> {
    const url = `${this.apiUrl}/search`;  
    return this.http.get<any[]>(url, { params: { query: searchTerm } }).pipe(
      map(data => data.map(item => ({
        id: item.id,
        MuseumName: item.MuseumName,
        Location: item.Location,
        PhoneNum: item.PhoneNum,
        Description: item.Description.replace(/\\u0027/g, "'"), // Fix escaped characters
        Fee: item.Fee,
        LengthOfVisit: item.LengthOfVisit,
        showDialog: false
      })))
    );
  }

  addMuseum(museum: MuseumAdd): Observable<any> {
    const url = `${this.apiUrl}/museum`;  
    // return this.museum;
    console.log(url);
    return this.http.post(url, museum, {headers: {'Content-Type': 'application/json'}});
  }

  deleteMuseum(museumId: string): Observable<any> {
    const url = `${this.apiUrl}/museum/${museumId}`;  
    console.log(url);
    return this.http.delete(url);
  }

  getMuseumDetails(id: string): Observable<any> {
    console.log(`${this.apiUrl}/museum/${id}/details`);
    return this.http.get<any>(`${this.apiUrl}/museum/${id}/details`).pipe(
      map(item => ({
        id: item.id,
        MuseumName: item.MuseumName,
        Location: item.Location,
        PhoneNum: item.PhoneNum,
        Description: item.Description.replace(/\\u0027/g, "'"),
        Fee: item.Fee,
        LengthOfVisit: item.LengthOfVisit,
        AverageRating: item.average_rating,
        ReviewCount: item.review_count,
        reviews: item.reviews,
        showDialog: false
      }))
    );
  }

  addReview(museumId: string, review: addReview): Observable<any> {
    const payload = {
      MuseumID: museumId,
      review: review.comment,
      // rating: `${review.rating}`
      rating: review.rating
    };
    console.log(payload);
    return this.http.post<any>(`${this.apiUrl}/review`, payload);
  }

  deleteReview(reviewId: string): Observable<any> {
    const url = `${this.apiUrl}/review/${reviewId}`;
    console.log(url);
    return this.http.delete<any>(url);
  }


  updateMuseum(museumId: string, updateData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/museum/${museumId}`, updateData);
  }

  fetchMesuem(museumId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/fetch-museum/${museumId}`);
  }

  getAllMuseums(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/museums`).pipe(
      map(data => data.map(item => ({
        id: item.id,
        MuseumName: item.MuseumName,
        Location: item.Location,
        PhoneNum: item.PhoneNum,
        Description: item.Description.replace(/\\u0027/g, "'"), // Fix escaped characters
        Fee: item.Fee,
        LengthOfVisit: item.LengthOfVisit,
        AverageRating: item.AverageRating,
        ReviewCount: item.ReviewCount,
        showDialog: false
      })))
    );
  }

}
