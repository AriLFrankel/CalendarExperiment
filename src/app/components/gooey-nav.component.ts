import { Component, AfterViewInit} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpService } from '../shared/http.service'
import { roomDictionary } from '../shared/room-dictionary'

declare const $: any
declare const moment: any

@Component({
  selector: 'hd-gooey-nav',
  templateUrl: './templates/gooey-nav.html',
  providers: [HttpService]
})

export class GooeyNavComponent implements AfterViewInit {
  private routeSubscription: any
  private roomId: string

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute
    ) {
    this.routeSubscription = this.route.params.subscribe(
    (params: any) => {
      this.roomId = roomDictionary[params['roomName']]
    })
  }

  ngAfterViewInit () {
    $('.menu-item, i').on('click', (e) => {
      $('.menu-open').prop('checked', false)
      $('hd-checkmark').css('display', 'block')
      $('hd-gooey-nav').css('display', 'none')
      e.preventDefault()
      this.httpService.bookRoom(this.roomId, e.target.id)
      this.httpService.statusEvent.emit({[this.roomId]: {color: 'red', statusChangeTime: moment().add(e.target.id, 'h')} })
    })
  }
}
