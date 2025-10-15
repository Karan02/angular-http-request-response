import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { catchError, map , throwError} from 'rxjs';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
  // providers: []
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef)
  // constructor(private httpClient: HttpClient){}

  ngOnInit(){
    this.isFetching.set(true)
    const subscription = this.httpClient.get<{places: Place[] }>('http://localhost:3000/places',{
      // observe: 'response' // 'event'
    })
    .pipe(
      map(
        (resData) => resData.places,
        catchError((error,obs) => throwError(() => new Error("Something went wrong fething the available places. Please try later")))
      )
    )
    .subscribe({
      next: (places) => { // ' event' or 'response'  
        // console.log(response);
        // console.log(response.body?.places);
        // console.log(event)
        this.places.set(places);
      },
      complete: () => {
        this.isFetching.set(false);
      },
      error: (error: Error) => {
        console.log(error);
        this.error.set(error.message);
      }
    });

    this.destroyRef.onDestroy(() =>{
      subscription.unsubscribe();
    })
  }
}
