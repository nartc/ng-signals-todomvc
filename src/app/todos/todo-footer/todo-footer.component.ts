import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoFilter } from '../todos.signal';

@Component({
    selector: 'app-todo-footer',
    standalone: true,
    template: `
        <footer id="footer" class="footer">
            <span id="todo-count" class="todo-count">{{ incompleteTodosCount }} items left</span>
            <ul id="filters" class="filters">
                <li>
                    <a routerLink="/all" [class.selected]="currentFilter === 'all'">All</a>
                </li>
                <li>
                    <a routerLink="/active" [class.selected]="currentFilter === 'active'">Active</a>
                </li>
                <li>
                    <a routerLink="/completed" [class.selected]="currentFilter === 'completed'">Completed</a>
                </li>
            </ul>
            <button
                id="clear-completed"
                *ngIf="hasCompletedTodos"
                class="clear-completed"
                (click)="clearCompleted.emit()"
            >
                Clear completed
            </button>
        </footer>
    `,
    imports: [RouterLink, NgIf],
})
export class TodoFooter {
    @Input() hasCompletedTodos = false;
    @Input() incompleteTodosCount = 0;
    @Input() currentFilter: TodoFilter = 'all';
    @Output() clearCompleted = new EventEmitter();
}
