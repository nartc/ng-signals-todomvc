import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NewTodo } from './new-todo/new-todo.component';
import { TodoFooter } from './todo-footer/todo-footer.component';
import { TodoList } from './todo-list/todo-list.component';
import { TodosSignal } from './todos.signal';

@Component({
    standalone: true,
    template: `
        <header class="header">
            <h1>todos</h1>
            <app-new-todo (addTodo)="todosSignal.add($event)" />
        </header>
        <app-todo-list
            *ngIf="todosSignal.hasTodos()"
            [todos]="todosSignal.filteredTodos()"
            (toggle)="todosSignal.toggle($event)"
            (update)="todosSignal.update($event.id, $event.text)"
            (delete)="todosSignal.delete($event)"
        />
        <app-todo-footer
            *ngIf="todosSignal.hasTodos()"
            [hasCompletedTodos]="todosSignal.hasCompletedTodos()"
            [incompleteTodosCount]="todosSignal.incompleteTodosCount()"
            [currentFilter]="todosSignal.filterParam()"
            (clearCompleted)="todosSignal.clearComplete()"
        />
    `,
    providers: [TodosSignal],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, NewTodo, TodoList, TodoFooter],
})
export default class Todos implements OnInit {
    readonly todosSignal = inject(TodosSignal);

    ngOnInit() {
        this.todosSignal.load();
    }
}
