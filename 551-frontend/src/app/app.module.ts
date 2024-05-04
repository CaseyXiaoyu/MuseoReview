import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EntranceComponent } from './entrance/entrance.component';
import { ManageComponent } from './manage/manage.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddMuseumComponent } from './add-museum/add-museum.component';
import { UpdateMuseumComponent } from './update-museum/update-museum.component';
import { ReviewsComponent } from './reviews/reviews.component';



@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    EntranceComponent,
    ManageComponent,
    AddMuseumComponent,
    UpdateMuseumComponent,
    ReviewsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
