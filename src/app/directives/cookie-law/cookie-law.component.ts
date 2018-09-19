import { CommonService } from '../../services/common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-law',
  templateUrl: './cookie-law.component.html',
  styleUrls: ['./cookie-law.component.css']
})
export class CookieLawComponent implements OnInit {

  constructor(public common: CommonService) { }

  ngOnInit() {
  }

  accept() {
    this.common.enableCookies();
    // location.reload();
  }

}
