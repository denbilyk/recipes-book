import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  styleUrls: ['./loading-spinner.component.scss'],
  template: `
    <div class="lds-ripple">
      <div></div>
      <div></div>
    </div>`
})
export class LoadingSpinnerComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
