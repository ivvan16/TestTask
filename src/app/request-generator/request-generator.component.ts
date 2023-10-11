import { Component } from '@angular/core';
import { catchError, delay, EMPTY, map, Observable, share, Subject, switchMap, takeUntil } from "rxjs";
import { HttpClient } from '@angular/common/http';

interface IRequestData {
  items: number[];
}

@Component({
  selector: 'app-request-generator',
  templateUrl: './request-generator.component.html',
  styleUrls: ['./request-generator.component.css']
})
export class RequestGeneratorComponent {
  private cancel$ = new Subject<void>();
  private request$ = new Subject<void>();
  private stream = this.request$.pipe(
    switchMap(() => {
      return this.http.get<IRequestData>(this.apiUrl).pipe(
        delay(this.delayTime),
      );
    }),
    share()
  );

  private streamsCount = 3;
  private delayTime = 500;
  private apiUrl = 'https://api.rand.by/v1/integer?count=1';

  streams: Observable<number>[];

  private contructStream(): Observable<number> {
    return this.stream.pipe(
      map((result: IRequestData) => result?.items[0]),
      catchError(() => EMPTY),
      takeUntil(this.cancel$)
    );
  }

  constructor(private http: HttpClient) {
    this.streams = new Array(this.streamsCount).fill(this.contructStream());
  }

  getData() {
    this.request$.next();
  }

  ngOnDestroy() {
    this.cancel$.next();
    this.cancel$.complete();
  }
}
