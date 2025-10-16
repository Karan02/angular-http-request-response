import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places',
      'Something went wrong fetching the available places. Please try again later.')
  }

  loadUserPlaces() {

     return this.fetchPlaces('http://localhost:3000/user-places',
      'Something went wrong fetching the favorite places. Please try again later.')
      .pipe(tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces) 
      }))

    }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();
    this.userPlaces.set([...prevPlaces,place]);
    
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id
    }).pipe(
      catchError(error => {
        this.userPlaces.set(prevPlaces);
        return throwError(() => new Error('Failed to store selected place.'))
      })
    )
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url:string, errorMessage:string) {
    //return observable
    return this.httpClient.get<{places: Place[] }>(url,{
        // observe: 'response' // 'event'
      })
      .pipe(
        map(
          (resData) => resData.places,
          catchError((error,obs) => throwError(() => 
            new Error(errorMessage)))
        )
      )
  }
}
