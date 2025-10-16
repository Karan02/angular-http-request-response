import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';

import { PlacesService } from '../places.service';

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

  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService)
  // constructor(private httpClient: HttpClient){}

  ngOnInit(){
    this.isFetching.set(true)
    const subscription = 
    this.placesService.loadAvailablePlaces().subscribe({ // must subscribe to trigger request
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

  onSelectPlace(selectedPlace: Place){
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (resData) => console.log(resData)
    }); // must subscribe to trigger request
    
    this.destroyRef.onDestroy(() =>{
      subscription.unsubscribe();
    })
  }
}
