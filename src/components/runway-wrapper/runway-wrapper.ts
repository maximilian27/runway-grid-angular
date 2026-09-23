import { Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, input, effect, OnInit } from '@angular/core';
import 'runway-grid'; // Instantiates the WASM engine and registers <runway-grid>

@Component({
  selector: 'app-runway-wrapper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <runway-grid
      #grid
      [attr.orientation]="orientation()"
      [attr.row-size]="rowSize()"
      [attr.buffer-size]="bufferSize()">
    </runway-grid>
  `,
  styles: [`
    :host { 
      display: block; 
      height: 400px; /* Ensure the host has physical dimensions */
      width: 400px; 
    }
  `]
})
export class RunwayWrapperComponent implements OnInit {
  @ViewChild('grid', { static: true }) gridRef!: ElementRef;

  // Signal Inputs
  items = input<any[]>([]);
  orientation = input<'vertical' | 'horizontal' | 'both'>('vertical');
  rowSize = input<number>(40);
  bufferSize = input<number>(10);

  constructor() {
    // Sync reactive Signal data to the Web Component's internal property
    effect(() => {
      if (this.gridRef?.nativeElement) {
        this.gridRef.nativeElement.data = this.items();
      }
    });
  }

  ngOnInit() {
    // The cell rendering function must be assigned programmatically.
    // Returning a raw HTML string is fastest, but you can also return a DOM Node here.
    this.gridRef.nativeElement.template = (item: any, rowIndex: number) => {
      if (!item) return '';
      return `
        <div style="padding: 10px; border-bottom: 1px solid #ccc; box-sizing: border-box;">
          <strong>Row ${rowIndex}</strong>: ${item.title}
        </div>
      `;
    };
  }
}