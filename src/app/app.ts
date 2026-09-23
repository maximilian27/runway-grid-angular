import { Component } from '@angular/core';
import {RunwayWrapperComponent} from "../components/runway-wrapper/runway-wrapper";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RunwayWrapperComponent],
  template: `
    <main style="height: 100vh; width: 100vw; margin: 0; overflow: hidden;">
      <app-runway-wrapper 
        [items]="massiveDataset"
        [rowSize]="50">
      </app-runway-wrapper>
    </main>
  `
})
export class AppComponent {
  massiveDataset = Array.from({ length: 500000 }).map((_, i) => ({
    id: i,
    title: `Dynamic Item ${i} - Generated perfectly`
  }));
}