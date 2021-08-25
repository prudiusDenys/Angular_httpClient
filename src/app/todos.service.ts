import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, delay, map, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';


export interface Todo {
    completed: boolean;
    title: string;
    id?: number;
}

@Injectable({
    providedIn: 'root'
})
export class TodosService {

    constructor(private http: HttpClient) {
    }

    addTodo(todo: Todo): Observable<Todo> {
        return this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo, {
            headers: new HttpHeaders({
                'MyCostomHeader': Math.random().toString()
            })
        });
    }

    fetchTodos(): Observable<Array<Todo>> {

        let params = new HttpParams();
        params = params.append('_limit', '4');
        params = params.append('custom', 'anything');

        return this.http.get<Array<Todo>>('https://jsonplaceholder.typicode.com/todos', {
            params,
            // params: new HttpParams().set('_limit', '3')
            observe: 'response'
        })
            .pipe(
                map(response => {
                    return response.body;
                }),
                delay(1500),
                catchError(err => {
                    console.log('Error', err.message);
                    return throwError(err);
                }));
    }

    removeTodo(id: number): Observable<any> {
        return this.http.delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            observe: 'events'
        }).pipe(
            tap(event => {
                if (event.type === HttpEventType.Sent) {
                    console.log('Sent', event);
                }
                if (event.type === HttpEventType.Response) {
                    console.log('Response', event);
                }
            })
        );
    }

    competeTodo(id: number): Observable<Todo> {
        return this.http.put<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            completed: true
        }, {
            responseType: 'json'
        });
    }
}
