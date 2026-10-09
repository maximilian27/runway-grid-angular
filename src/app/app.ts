import { Component } from '@angular/core';
import { RunwayVerticalListExampleComponent } from '../components/examples/runway-vertical-list/runway-vertical-list';
import { RunwayHorizontalListExampleComponent } from '../components/examples/runway-horizontal-list/runway-horizontal-list';
import { RunwayGrid2dExampleComponent } from '../components/examples/runway-grid-2d/runway-grid-2d';

@Component({
  selector: 'app-root',
  imports: [RunwayVerticalListExampleComponent, RunwayHorizontalListExampleComponent, RunwayGrid2dExampleComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {}

