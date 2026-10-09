import { Component } from '@angular/core';
import { RunwayVerticalListExampleComponent } from '../components/examples/runway-vertical-list/runway-vertical-list';
import { RunwayHorizontalListExampleComponent } from '../components/examples/runway-horizontal-list/runway-horizontal-list';

@Component({
  selector: 'app-root',
  imports: [RunwayVerticalListExampleComponent, RunwayHorizontalListExampleComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {}

