import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'
import { HttpService } from './http.service'

@Component({
  selector: 'hd-rooms',
  template:
  `
    <div class="room2 row" *ngFor='let room of rooms'
    [ngClass]="room"
    >
      <div class="col-md-8"><a class="room-name" [routerLink]='[room.summary.slice(6)]'>{{room.summary.slice(6)}}</a></div>
      <div class="status" id={{room.id}}
      [(style.background)]='room.busy'
      >
      </div>
    </div>
  `,
  providers: [HttpService]
})
export class RoomsComponent implements OnDestroy {
  rooms: any[] = []
  events: any[] = []
  subscription: any
  constructor(private httpService: HttpService, private ref: ChangeDetectorRef) {
    ref.detach()
    this.subscription = this.httpService.statusEvent
    .subscribe(roomBusy => {
      for (const roomBusyKey in roomBusy) {
        if (roomBusy.hasOwnProperty(roomBusyKey)) {
          for (const roomKey in this.rooms) {
            if (this.rooms.hasOwnProperty(roomKey) && this.rooms[roomKey].id === roomBusyKey) {
              this.rooms[roomKey].busy = roomBusy[roomBusyKey]
              this.ref.detectChanges()
            }
          }
        }
      }
    })
    const getRooms = this.getRooms.bind( this)
    const getStatuses = this.getStatuses.bind( this)
    setTimeout(getRooms, 1200)
    setInterval(getStatuses, 3400)
  }

  getRooms() {
    this.httpService.getRooms(
      [
       'hackreactor.com_2d373931333934353637@resource.calendar.google.com',
       'hackreactor.com_32333137383234383439@resource.calendar.google.com',
       'hackreactor.com_3538363731393438383137@resource.calendar.google.com',
       'hackreactor.com_3136303231303936383132@resource.calendar.google.com',
       'hackreactor.com_3532303334313531373535@resource.calendar.google.com',
       'hackreactor.com_38343938353038373437@resource.calendar.google.com',
       /*'hackreactor.com_ljtk4epeeca4bm4b73m09cb4c4@group.calendar.google.com',
       'hackreactor.com_9kddcjfdij7ak91o0t2bdlpnoo@group.calendar.google.com',*/
       'hackreactor.com_3836363230383730323630@resource.calendar.google.com',
       /*'hackreactor.com_2d3433363932323136393534@resource.calendar.google.com',
       'hackreactor.com_2d3231313833303133383036@resource.calendar.google.com',*/
        ])
    .then( (roomsObj) => {
      this.rooms = []
      this.events = []
      for (const roomKey in roomsObj) {
        if (roomsObj.hasOwnProperty(roomKey)) {
          const room = roomsObj[roomKey]
          room.busy = 'green'
          this.rooms.push(room)
        }
      }
    })
  }

  getStatuses() {
    this.rooms.forEach( (room: any) => {
      this.httpService.getStatus(room.id)
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
