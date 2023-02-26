import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NewTodo } from './new-todo/new-todo.component';
import { TodoFooter } from './todo-footer/todo-footer.component';
import { TodoList } from './todo-list/todo-list.component';
import { provideTodosStore, TODOS_STORE } from './todos.signal';

@Component({
    standalone: true,
    template: `
        <header class="header">
            <h1>todos</h1>
            <app-new-todo (addTodo)="todosStore.add($event)" />
        </header>
        <app-todo-list
            *ngIf="todosStore.hasTodos()"
            [todos]="todosStore.filteredTodos()"
            (toggle)="todosStore.toggle($event)"
            (update)="todosStore.update($event.id, $event.text)"
            (delete)="todosStore.delete($event)"
        />
        <app-todo-footer
            *ngIf="todosStore.hasTodos()"
            [hasCompletedTodos]="todosStore.hasCompletedTodos()"
            [incompleteTodosCount]="todosStore.incompleteTodosCount()"
            [currentFilter]="todosStore.filterParam()"
            (clearCompleted)="todosStore.clearComplete()"
        />
    `,
    providers: [provideTodosStore()],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, NewTodo, TodoList, TodoFooter],
})
export default class Todos implements OnInit {
    readonly todosStore = inject(TODOS_STORE);

    ngOnInit() {
        this.todosStore.load();
    }
}
