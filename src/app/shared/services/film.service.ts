import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, ReplaySubject } from 'rxjs';

export interface Film{
  Actors: string;
  Awards: string;
  BoxOffice: string;
  Country: string;
  DVD: string;
  Director: string;
  Genre: string;
  Language: string;
  Metascore: string;
  Plot: string;
  Poster: string;
  Production: string;
  Rated: string;
  Released: string;
  Response: string;
  Runtime: string;
  Title: string;
  Type: string;
  Website: string;
  Writer: string;
  Year: string;
  imdbID: string;
  imdbRating: string;
  imdbVotes: string;
}

export interface FilmSimple{
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface ResponseFilmSimple{
  Search: FilmSimple[];
  totalResults: string;
  Response: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  private changeSavedFilms = new ReplaySubject<FilmSimple[]>(1);
  public savedFilms = this.changeSavedFilms.asObservable();
  
  constructor(private http: HttpClient){
    let saved = localStorage.getItem('saved');
    let savedList = saved ? JSON.parse(saved) : [];
    this.changeSavedFilms.next(savedList);
  }

  public loadFilms(search: string, page: number): Observable<ResponseFilmSimple> {
    return this.http.get<ResponseFilmSimple>(`/omdbapi?s=${search}&page=${page}`);
  }

  public getFilmInfo(id: string): Observable<Film> {
    return this.http.get<Film>(`/omdbapi?i=${id}&plot=full`);
  }

  public saveFilm(film: FilmSimple): boolean {
    let saved = localStorage.getItem('saved');
    let savedList = saved ? JSON.parse(saved) : [];
    if(this.findIndexSaved(film.imdbID) !== -1) {
      return false;
    }
    savedList.unshift(film);
    this.changeSavedFilms.next(savedList);
    localStorage.setItem('saved', JSON.stringify(savedList));
    return true;
  }

  public removeFilm(id: string) {
    const index = this.findIndexSaved(id);
    if(index === -1){
      return;
    }
    let saved = localStorage.getItem('saved');
    let savedList = saved ? JSON.parse(saved) : [];
    savedList.splice(index, 1);
    this.changeSavedFilms.next(savedList);
    localStorage.setItem('saved', JSON.stringify(savedList));
  }

  private findIndexSaved(id: string) {
    let saved = localStorage.getItem('saved');
    let savedList = saved ? JSON.parse(saved) : [];
    return savedList.findIndex((current) => {
      return current.imdbID == id;
    })
  }

  public isSavedFilm(id: string){
    return this.findIndexSaved(id) !== -1;
  }

}