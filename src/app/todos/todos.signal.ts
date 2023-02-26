import { ChangeDetectorRef, computed, inject, InjectionToken, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { fromObservable } from '../rxjs-interop/from-observable';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
    id: number;
    text: string;
    creationDate: Date;
    completed: boolean;
}

function todosSignalFactory(cdr = inject(ChangeDetectorRef), route = inject(ActivatedRoute)) {
    const todos = signal<Todo[]>([]);

    const filterParam = fromObservable(route.params.pipe(map((params) => params['filter'])), 'all');
    const filteredTodos = computed(() => {
        switch (filterParam()) {
            default:
            case 'all':
                return todos();
            case 'active':
                return todos().filter((todo) => !todo.completed);
            case 'completed':
                return todos().filter((todo) => todo.completed);
        }
    });

    const hasTodos = computed(() => todos().length > 0);
    const hasCompletedTodos = computed(() => todos().some((todo) => todo.completed));
    const incompleteTodosCount = computed(() => todos().filter((todo) => !todo.completed).length);

    return {
        filterParam,
        filteredTodos,
        hasTodos,
        hasCompletedTodos,
        incompleteTodosCount,
        load: async () => {
            todos.set(await fetch('assets/todos.json').then((res) => res.json()));
            cdr.markForCheck();
        },
        add: (text: string) => {
            todos.mutate((v) => {
                v.push({ id: Math.random(), text, creationDate: new Date(), completed: false });
            });
        },
        toggle: (id: number) => {
            todos.mutate((v) => {
                const todo = v.find((todo) => todo.id === id);
                if (todo) todo.completed = !todo.completed;
            });
        },
        delete: (id: number) => {
            todos.update((v) => v.filter((todo) => todo.id !== id));
        },
        update: (id: number, text: string) => {
            todos.mutate((v) => {
                const todo = v.find((todo) => todo.id === id);
                if (todo) todo.text = text;
            });
        },
        clearComplete: () => {
            todos.update((v) => v.filter((todo) => !todo.completed));
        },
    };
}

export const TODOS_STORE = new InjectionToken<ReturnType<typeof todosSignalFactory>>('TodosStore with Signals');

export function provideTodosStore() {
    return { provide: TODOS_STORE, useFactory: todosSignalFactory };
}
