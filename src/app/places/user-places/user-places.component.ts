import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {  AsyncPipe } from "@angular/common"

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent,AsyncPipe],
})
export class UserPlacesComponent implements OnInit {
    // places = signal<Place[] | undefined>(undefined);
    isFetching = signal(false);
    error = signal('');
    private placesService = inject(PlacesService);
    private destroyRef = inject(DestroyRef);
    // places = this.placesService.loadUserPlaces;
    places$ = this.placesService.loadUserPlaces();

    ngOnInit(){
      this.isFetching.set(true)
      const subscription = this.placesService.loadUserPlaces()
      .subscribe({
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
