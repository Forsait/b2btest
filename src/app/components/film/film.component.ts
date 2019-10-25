import { Component } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { FilmsService, Film } from '../../shared/services/film.service';

@Component({
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss'],
})
export class FilmInfoComponent {
  routeSub: Subscription;
  filmInfo: Film;
  isSaved: boolean;

  constructor(
    private router: ActivatedRoute,
    private filmService: FilmsService,  
  ){ }

  ngOnInit() {
    this.routeSub = this.router.params.subscribe(params => {

      this.getFilmInfo(params.imbqid)
      .subscribe(res => {
        console.log(res);
        this.filmInfo = res;
        this.isSaved = this.filmService.isSavedFilm(this.filmInfo.imdbID);
      })

    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  getFilmInfo(id: string) {
    return this.filmService.getFilmInfo(id);
  }

  saveFilm() {
    this.filmService.saveFilm({
      Title: this.filmInfo.Title,
      Year: this.filmInfo.Year,
      imdbID: this.filmInfo.imdbID,
      Type: this.filmInfo.Type,
      Poster: this.filmInfo.Poster,
    });
    this.isSaved = true;
  }

  removeFilm(){
    this.filmService.removeFilm(this.filmInfo.imdbID);
    this.isSaved = false;
  }
}