import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    template: `
        <section class="todoapp">
            <router-outlet></router-outlet>
        </section>
        <footer class="info">
            <p>Double-click to edit a todo</p>
            <p>
                Part of
                <a href="http://todomvc.com">TodoMVC</a>
            </p>
        </footer>
    `,
    imports: [RouterOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
