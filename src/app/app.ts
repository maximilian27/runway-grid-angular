import { Component } from '@angular/core';
import { RunwayVerticalListExampleComponent } from '../components/examples/runway-vertical-list/runway-vertical-list';
import { RunwayHorizontalListExampleComponent } from '../components/examples/runway-horizontal-list/runway-horizontal-list';
import { RunwayGrid2dExampleComponent } from '../components/examples/runway-grid-2d/runway-grid-2d';
import { RunwayInfiniteVerticalExampleComponent } from '../components/examples/runway-infinite-vertical/runway-infinite-vertical';
import { RunwaySlidingVerticalExampleComponent } from '../components/examples/runway-sliding-vertical/runway-sliding-vertical';

@Component({
  selector: 'app-root',
  imports: [
    RunwayVerticalListExampleComponent,
    RunwayHorizontalListExampleComponent,
    RunwayGrid2dExampleComponent,
    RunwayInfiniteVerticalExampleComponent,
    RunwaySlidingVerticalExampleComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {}

