import { Component, OnInit } from '@angular/core';
import { StockDataService } from '../stock-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isLoggedIn = false;

  constructor() {}

  ngOnInit() {}

}
