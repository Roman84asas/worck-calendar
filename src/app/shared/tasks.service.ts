import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import * as moment from "moment";

export interface Task {
  id?: string,
  title: string,
  date?: string
}

interface CreateRespone {
  name: string
}

@Injectable({
  providedIn: 'root'
})

export class TaskaService {
  static public_url = 'https://work-calendar-6f875.firebaseio.com/';

  constructor(private http: HttpClient){}

  load(date: moment.Moment): Observable<Task[]>{
    return this.http
      .get<Task[]>(`${TaskaService.public_url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map (tasks => {
        if (!tasks){
          return []
        }
        return Object.keys(tasks).map( key => ({ ...tasks[key], id: key}))
      }))
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateRespone>(`${TaskaService.public_url}/${task.date}.json`, task)
      .pipe(map(res => {
        return {...task, id: res.name}
      }))
  }

  remove(task: Task): Observable<void> {
    return this.http
      .delete<void>(`${TaskaService.public_url}/${task.date}/${task.id}.json`)
  }
}
