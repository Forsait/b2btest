import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, Subscription, merge, fromEvent } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

import { FilmsService, FilmSimple } from '../../shared/services/film.service';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('formelem', {static: false}) formElem: ElementRef;

  private changesPaginatorSub = new Subject<PageEvent>();
  private changesPaginator = this.changesPaginatorSub.asObservable();

  isShowAutocomplete: boolean;

  autoItems: FilmSimple[] = [];
  searchForm: FormControl;
  valueChangesSubs: Subscription;
  searchSubs: Subscription;
  page = 1;

  searchResults: FilmSimple[] = [];
  totalSearchResults: number = 0;

  savedFilmArray: Observable<FilmSimple[]>;

  constructor(private filmsService: FilmsService) {
    this.searchForm = new FormControl();
    this.savedFilmArray = this.filmsService.savedFilms;
  }

  ngOnInit() {
    this.subscribeToAutocomplete();
  }

  ngAfterViewInit() {
    this.subscribeToSearch();
  }

  ngOnDestroy() {
    this.searchSubs.unsubscribe();
    this.valueChangesSubs.unsubscribe();
  }

  subscribeToAutocomplete() {
    this.valueChangesSubs = this.searchForm.valueChanges.pipe(
      debounceTime(100),
      switchMap(() => {
        this.page = 1;
        this.autoItems = [];
        this.isShowAutocomplete = true;
        const val = this.searchForm.value;
        return this.loadFilms(val, this.page);
      })
    ).subscribe(films => {
      this.autoItems = films.Search || [];
    })
  }

  subscribeToSearch() {
    this.searchSubs = merge(
      fromEvent(this.formElem.nativeElement, 'submit'),
      this.changesPaginator
    )
    .pipe(
      tap(() => {
        this.isShowAutocomplete = false;
      }),
      switchMap(() => {
        const val = this.searchForm.value;
        return this.loadFilms(val, this.page);
      })
    )
    .subscribe(filmsResponse => {
      this.searchResults = filmsResponse.Search || [];
      this.totalSearchResults = parseInt( filmsResponse.totalResults, 10);
    })
  }

  removeSaved(id: string) {
    this.filmsService.removeFilm(id);
  }

  loadFilms(search: string, page: number) {
    return this.filmsService.loadFilms(search, page)
  }

  saveItem(film: FilmSimple) {
    this.filmsService.saveFilm( film );
    this.isShowAutocomplete = false;
  }

  changePage(page: PageEvent){
    this.page = page.pageIndex;
    this.changesPaginatorSub.next(page);
  }

}