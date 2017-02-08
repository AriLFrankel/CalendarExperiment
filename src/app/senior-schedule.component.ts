import { Component } from '@angular/core';
import { HttpService } from './http.service';


@Component({
  selector: 'hd-senior-schedule',
  template: `
  <div>
    <div>Senior Schedule</div>
    <div *ngFor='let event of events'>{{event.summary}}</div>
  </div>
    <button (click)="getSchedule()">get senior schedule</button>
  `,
  providers: [HttpService]
})
export class SeniorScheduleComponent {
  events:any[] = [];

  constructor(private httpService:HttpService) { }

  getSchedule() {
    this.httpService.getEvents('hackreactor.com_ljtk4epeeca4bm4b73m09cb4c4@group.calendar.google.com')
    .then( (events) => {
      this.events = [].concat(events)
    })
  }

}
