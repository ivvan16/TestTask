import { Component } from '@angular/core';
import { BehaviorSubject, catchError, delay, EMPTY, map, Observable, of, skip, Subject, Subscription, switchMap, takeUntil, tap, withLatestFrom } from "rxjs";
import { HttpClient } from '@angular/common/http';

interface IRequestData {
  items: number[];
}

type ShowType = number | 'unset';

@Component({
  selector: 'app-request-generator',
  templateUrl: './request-generator.component.html',
  styleUrls: ['./request-generator.component.css']
})
export class RequestGeneratorComponent {
  private cancel$ = new Subject<void>();
  private request$ = new Subject<void>();

  private streamsCount = 3;
  private delayTime = 500;
  private apiUrl = 'https://api.rand.by/v1/integer?count=1';

  streams: BehaviorSubject<ShowType>[];

  private contructStream(): BehaviorSubject<ShowType> {
    return new BehaviorSubject<ShowType>('unset');
  }

  constructor(private http: HttpClient) {
    this.streams = new Array(this.streamsCount).fill(this.contructStream());

    this.request$.pipe(
      switchMap(() => {
        return this.http.get<IRequestData>(this.apiUrl).pipe(
          delay(this.delayTime)
        );
      }),
      tap((result: IRequestData) => {
        this.streams.forEach(stream => stream.next(result?.items[0]));
      }),
      catchError(() => EMPTY),
      takeUntil(this.cancel$)
    ).subscribe();
  }

  getData() {
    this.request$.next();
  }

  ngOnDestroy() {
    this.cancel$.next();
    this.cancel$.complete();
  }
}
