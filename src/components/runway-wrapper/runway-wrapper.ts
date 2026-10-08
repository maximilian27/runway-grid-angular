import {
  afterNextRender,
  Component,
  contentChild,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  OnInit,
  Signal,
  TemplateRef,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import 'runway-grid'; // Instantiates the WASM engine and registers <runway-grid>

@Component({
  selector: 'app-runway-wrapper',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './runway-wrapper.html',
  styleUrls: ['./runway-wrapper.scss'],
})

export class RunwayWrapperComponent implements OnInit {
  public items = input<any[]>([]);
  public orientation = input<'vertical' | 'horizontal' | 'both'>('vertical');
  public rowSize = input<number>(40);
  public bufferSize = input<number>(10);

  public userTemplate = contentChild<TemplateRef<any>>(TemplateRef);
  private gridRef: Signal<ElementRef> = viewChild.required<ElementRef>('grid');

  constructor(private viewContainerRef: ViewContainerRef) {
    // Replaces the effect() hook: pushes data updates imperatively once rendered/updated
    afterNextRender(() => {
      const grid = this.gridRef()?.nativeElement;
      if (grid) {
        grid.data = this.items();
      }
    });
  }

  public ngOnInit() {
    const templateRef = this.userTemplate();

    this.gridRef().nativeElement.template = (item: any, rowIndex: number, colIndex: number) => {
      if (!item) return document.createElement('div');

      const container = document.createElement('div');
      container.setAttribute('part', 'cell-content');

      if (templateRef) {
        const embeddedView = this.viewContainerRef.createEmbeddedView(templateRef, {
          $implicit: item,
          index: rowIndex,
          col: colIndex
        });
        embeddedView.detectChanges();

        embeddedView.rootNodes.forEach(node => container.appendChild(node));
      } else {
        container.textContent = String(item.title || JSON.stringify(item));
      }

      return container;
    };
  }

  public scrollToIndex(index: number): void {
    const grid = this.gridRef()?.nativeElement;
    if (grid && typeof grid.scrollToIndex === 'function') {
      grid.scrollToIndex(index);
    }
  }

  public scrollToCell(rowIndex: number, colIndex: number = 0): void {
    const grid = this.gridRef()?.nativeElement;
    if (grid && typeof grid.scrollToCell === 'function') {
      grid.scrollToCell(rowIndex, colIndex);
    }
  }
}