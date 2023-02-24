import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideRouter(
            [
                { path: ':filter', loadChildren: () => import('./app/todos/todos.routes') },
                { path: '**', redirectTo: 'all', pathMatch: 'full' },
            ],
            withHashLocation()
        ),
    ],
}).catch((err) => console.error(err));
