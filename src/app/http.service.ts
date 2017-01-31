import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

declare var gapi:any;
declare var moment:any;
 
@Injectable()
export class HttpService {
  
  @Output() 
  statusEvent:EventEmitter<any> = new EventEmitter();
  
  getRooms(rooms:string[]) {
    return Promise.all(rooms.map((room) => {
      return gapi.client.calendar.calendars.get({
        'calendarId': room
      });  
    }))
    .then(roomsData =>
      roomsData.map(room => room.result)
    )
    .then((roomsInfo)=>{
      console.log(roomsInfo)
      return roomsInfo;
    })
  }

  getEvents(room:string){
    let todayMin = new Date(new Date().toString().split(' ').slice(0,4).concat(['00:01:00']).join(' ')).toISOString()
    let todayMax = new Date(new Date().toString().split(' ').slice(0,4).concat(['23:59:59']).join(' ')).toISOString()

    return gapi.client.calendar.events.list({
      'calendarId': room,
      'timeMin': todayMin,
      'timeMax': todayMax,
      'minAccessRole': 'freeBusyReader',
      'orderBy': 'startTime',
      'singleEvents': true
    })
    .then(eventData => {
      console.log(eventData, eventData.result.items)
      return eventData.result.items
    })
  }

  addHours= function(h){
    this.setHours(this.getHours() + h);
    return this;
  }

   getStatus(roomId){
    let currentTime = moment().add(-6, 'h').toISOString(),
    start:string, end:string;
    gapi.client.calendar.freebusy.query({
      "timeMin": (new Date()).toISOString(),
      "timeMax": this.addHours.call(new Date(),8).toISOString(),
      "timeZone": "America/Chicago",
      "items": [
        {
          "id": roomId
        }
      ]
    }).execute( (response) => {
      console.log('checkStatus: ', response.result.calendars[roomId].busy);
      response.result.calendars[roomId].busy.forEach((busyObj) => {
        start = moment(busyObj.start).add(-6, 'h').add(-1, 'm').toISOString()
        end = moment(busyObj.start).add(-6, 'h').add(-1, 'm').toISOString()
        if(start <= currentTime && end <= currentTime){
          console.log("busy, let's fire an event");
         this.statusEvent.emit({[roomId]: 'red'});
         }
      })
      console.log('we are here without any busy events', this.statusEvent)
      this.statusEvent.emit({[roomId]: 'green'});
    })
  }

}