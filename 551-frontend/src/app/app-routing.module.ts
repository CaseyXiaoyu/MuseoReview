import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntranceComponent } from './entrance/entrance.component';
import { SearchComponent } from './search/search.component';
import { ManageComponent } from './manage/manage.component';
import { AddMuseumComponent } from './add-museum/add-museum.component';
import { UpdateMuseumComponent } from './update-museum/update-museum.component';
import { ReviewsComponent } from './reviews/reviews.component';


const routes: Routes = [
  { path: '', redirectTo: '/entrance', pathMatch: 'full' }, // Redirect root to Entrance
  { path: 'entrance', component: EntranceComponent },
  { path: 'Manage/add-museum', component: AddMuseumComponent },
  { path: 'Manage/update-museum/:id', component: UpdateMuseumComponent },
  { path: 'Search', component: SearchComponent },
  { path: 'Manage', component: ManageComponent },
  { path: 'Search/Reviews/:id', component: ReviewsComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
