import {Component} from '@angular/core';
import {RunwayWrapperComponent} from "../components/runway-wrapper/runway-wrapper";

@Component({
  selector: 'app-root',
  imports: [RunwayWrapperComponent],
  templateUrl: './app.html'
})
export class AppComponent {
  massiveDataset = Array.from({length: 500000}).map((_, i) => ({
    id: i,
    title: `Dynamic Item ${i}`
  }));
}