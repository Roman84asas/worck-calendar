import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {DateService} from "../shared/date.service";

interface Day {
  value:    moment.Moment,
  active:   boolean,
  disabled: boolean,
  selected: boolean
}

interface Week {
  days: Day[],
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendar: Week[];

  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.dateService.date.subscribe(this.generate.bind(this))
  }

  generate(value: moment.Moment){
    const startDay = value.clone().startOf('month').startOf('week');
    const endDay   = value.clone().endOf('month').endOf('week');
    const date     = startDay.clone().subtract(1, 'day');
    const calendar = [];

    while (date.isBefore(endDay, 'day')){
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(()=>{
            const valueDate   = date.add(1, 'day').clone();
            const active      = moment().isSame(valueDate, 'day');
            const disable     = !value.isSame(valueDate, 'month');
            const selected    = value.isSame(valueDate, 'date');

            return {
              valueDate,
              active,
              disable,
              selected
            }
          })
        }
      )

    }
    this.calendar = calendar;
  }

  select(day: moment.Moment) {
    this.dateService.changeNawDate(day);
  }
}
