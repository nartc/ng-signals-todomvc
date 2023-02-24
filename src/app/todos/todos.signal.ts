import { ChangeDetectorRef, computed, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { fromObservable } from '../rxjs-interop/from-observable';

export type TodoFilter = 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED';

export interface Todo {
    id: number;
    text: string;
    creationDate: Date;
    completed: boolean;
}

@Injectable()
export class TodosSignal {
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);

    private readonly filterParam = fromObservable(this.route.params.pipe(map((params) => params['filter'])), 'all');
    private readonly todos = signal<Todo[]>([]);

    readonly filter = computed<TodoFilter>(() => {
        switch (this.filterParam()) {
            case 'active': {
                return 'SHOW_ACTIVE';
            }
            case 'completed': {
                return 'SHOW_COMPLETED';
            }
            default: {
                return 'SHOW_ALL';
            }
        }
    });

    readonly filteredTodos = computed(() => {
        switch (this.filter()) {
            default:
            case 'SHOW_ALL':
                return this.todos();
            case 'SHOW_ACTIVE':
                return this.todos().filter((todo) => !todo.completed);
            case 'SHOW_COMPLETED':
                return this.todos().filter((todo) => todo.completed);
        }
    });

    readonly hasTodos = computed(() => this.todos().length > 0);
    readonly hasCompletedTodos = computed(() => this.todos().some((todo) => todo.completed));
    readonly incompleteTodosCount = computed(() => this.todos().filter((todo) => !todo.completed).length);

    load() {
        fetch('assets/todos.json')
            .then((res) => res.json())
            .then((data) => {
                this.todos.set(data);
                this.cdr.detectChanges();
            });
    }

    add(text: string) {
        this.todos.update((todos) => {
            return [...todos, { id: Math.random(), text, creationDate: new Date(), completed: false }];
        });
    }

    toggle(id: number) {
        this.todos.update((todos) =>
            todos.map((todo) => {
                todo.completed = todo.id === id ? !todo.completed : todo.completed;
                return todo;
            })
        );
    }

    delete(id: number) {
        this.todos.update((todos) => todos.filter((todo) => todo.id !== id));
    }

    update(id: number, text: string) {
        this.todos.update((todos) =>
            todos.map((todo) => {
                todo.text = todo.id === id ? text : todo.text;
                return todo;
            })
        );
    }

    clearComplete() {
        this.todos.update((todos) => todos.filter((todo) => !todo.completed));
    }
}