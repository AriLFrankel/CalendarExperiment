import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'
import { HttpService } from './http.service'
import { roomDictionary } from './room-dictionary'

declare const $: any

@Component({
  selector: 'hd-rooms',
  template:
  `
    <div *ngFor='let room of rooms' class="room2 row col-md-12" >
      <a class="room-name" [routerLink]='[room.summary.slice(6)]'>{{room.summary.slice(6)}}</a>
      <div class="status" id={{room.id}}
      [(style.background)]='room.busy'
      ></div>
    </div>
  `,
  providers: [HttpService]
})
export class RoomsComponent implements OnDestroy {
  rooms: any[] = []
  events: any[] = []
  subscription: any
  constructor(private httpService: HttpService, private ref: ChangeDetectorRef) {
    this.subscription = this.httpService.statusEvent
    .subscribe(roomBusy => {
      this.ref.detach()
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
    setTimeout( getRooms, 1200)
    setTimeout( getStatuses, 3000)
    setInterval( getStatuses, 60000)
  }

  getRooms() {
    this.httpService.getRooms([
        roomDictionary.Hamilton,
        roomDictionary.Ellis,
        roomDictionary.Lovelace,
        roomDictionary.Hopper,
        roomDictionary.Turing,
        roomDictionary.Djikstra
      ])
    .then( (roomsArr) => {
      this.events = []
      for (const roomKey in roomsArr) {
        if (roomsArr.hasOwnProperty(roomKey)) {
          const room = roomsArr[roomKey]
          this.rooms.push(room)
        }
      }
      this.ref.detectChanges()
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
