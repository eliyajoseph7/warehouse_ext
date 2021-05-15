import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  index;
  constructor() { }

  ngOnInit(): void {
    if (window.location.href.indexOf("managements") > -1) {
      this.index = 0;
    }
    if (window.location.href.indexOf("markets") > -1) {
      this.index = 1;
    }
    if (window.location.href.indexOf("crops") > -1) {
      this.index = 2;
    }
    if (window.location.href.indexOf("manage-stocks") > -1) {
      this.index = 3;
    }
  }

}
