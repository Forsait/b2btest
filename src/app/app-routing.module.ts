import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { FilmInfoComponent } from './components/film/film.component';

const routes: Routes = [{
  path: '',
  component: MainComponent,
}, {
  path: 'id/:imbqid',
  component: FilmInfoComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
