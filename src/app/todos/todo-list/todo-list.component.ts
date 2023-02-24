import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoItem } from '../todo-item/todo-item.component';
import { Todo } from '../todos.signal';

@Component({
    selector: 'app-todo-list',
    standalone: true,
    template: `
        <section id="main" class="main">
            <div class="toogle-view" *ngIf="todos.length > 0"></div>
            <ul id="todo-list" class="todo-list">
                <app-todo-item
                    *ngFor="let todo of todos; trackBy: todosTrackByFn"
                    [todo]="todo"
                    (toggle)="toggle.emit($event)"
                    (update)="update.emit($event)"
                    (delete)="delete.emit($event)"
                />
            </ul>
        </section>
    `,
    imports: [NgIf, NgFor, TodoItem],
})
export class TodoList {
    @Input() todos: Todo[] = [];
    @Output() toggle = new EventEmitter<number>();
    @Output() update = new EventEmitter<{ id: number; text: string }>();
    @Output() delete = new EventEmitter<number>();

    todosTrackByFn(_: number, item: Todo): number {
        return item.id;
    }
}
