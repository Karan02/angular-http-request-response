import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpEventType, HttpHandler, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs';


// also check class based interceptors
function loggingInterceptor(request:HttpRequest<unknown>,next:HttpHandlerFn) {
    // const req = request.clone(
    //     {
    //         headers: request.headers.set('X-DEBUG','TESTING')
    //     }
    // );
    console.log('[Outgoing Request]');
    console.log(request);
    return next(request).pipe(
        tap({
            next: event => {
                if(event.type === HttpEventType.Response){
                    console.log("[Incoming Response]")
                    console.log(event.status)
                    console.log(event.body)
                }
            } // will get event resp
        })
    );
}

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(
        withInterceptors([loggingInterceptor])
    )]
}).catch((err) => console.error(err));
