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
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import 'runway-grid'; // Instantiates the WASM engine and registers <runway-grid>

@Component({
  selector: 'app-runway-wrapper',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './runway-wrapper.html',
  styleUrls: ['./runway-wrapper.scss'],
  encapsulation: ViewEncapsulation.None

})
export class RunwayWrapperComponent implements OnInit {
  items = input<any[]>([]);
  orientation = input<'vertical' | 'horizontal' | 'both'>('vertical');
  rowSize = input<number>(40);
  bufferSize = input<number>(10);

  userTemplate = contentChild<TemplateRef<any>>(TemplateRef);
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

  ngOnInit() {
    const templateRef = this.userTemplate();

    // Inject component styles into the custom element's Shadow DOM once
    const shadowRoot = this.gridRef().nativeElement.shadowRoot;
    if (shadowRoot && !shadowRoot.querySelector('#wrapper-injected-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'wrapper-injected-styles';
      styleEl.textContent = `
      .row-card {
        box-sizing: border-box;
        width: 100%;
        padding: 10px 16px;
        border-bottom: 1px solid #e0e0e0;
        background: #ffffff;
        font-family: system-ui, -apple-system, sans-serif;
        transition: background-color 0.15s ease;
      }
      .row-card.is-expanded { background: #f0f7ff; }
      .row-header { display: flex; align-items: center; justify-content: space-between; }
      .row-info { display: flex; align-items: center; gap: 12px; }
      .row-badge { background: #0066ff; color: #ffffff; font-weight: 600; font-size: 11px; padding: 2px 8px; border-radius: 12px; }
      .row-title { font-size: 14px; color: #1a1a1a; font-weight: 500; }
      .expand-btn { background: #ffffff; border: 1px solid #0066ff; color: #0066ff; font-weight: 600; font-size: 12px; padding: 4px 12px; border-radius: 4px; cursor: pointer; }
      .expand-btn.active { background: #0066ff; color: #ffffff; }
      .row-details { margin-top: 10px; padding: 12px; background: #ffffff; border-left: 3px solid #0066ff; border-radius: 4px; font-size: 13px; color: #4a5568; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
      .row-details p { margin: 6px 0 0 0; line-height: 1.4; }
    `;
      shadowRoot.appendChild(styleEl);
    }

    this.gridRef().nativeElement.template = (item: any, rowIndex: number, colIndex: number) => {
      if (!item) return document.createElement('div');

      const container = document.createElement('div');

      if (templateRef) {
        const embeddedView = this.viewContainerRef.createEmbeddedView(templateRef, {
          $implicit: item,
          index: rowIndex,
          col: colIndex
        });

        embeddedView.rootNodes.forEach(node => container.appendChild(node));
      } else {
        container.textContent = String(item.title || JSON.stringify(item));
      }

      return container;
    };
  }
}