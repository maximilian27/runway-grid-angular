import {Component, viewChild, ViewEncapsulation} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RunwayWrapperComponent} from '../../runway-wrapper/runway-wrapper';

const HORIZONTAL_COUNT = 5000;

// Chip labels of varying length - each one renders to a different natural width.
const H_LABELS = [
  'New', 'Featured', 'Popular this week', 'Limited Edition', 'Sale',
  'Back in Stock', 'Staff Pick', 'Trending Now', 'Almost Gone', 'Best Seller',
];
const H_COLORS = ['#0070f3', '#ff3333', '#00a86b', '#ff9900', '#8e44ad'];

@Component({
  selector: 'app-runway-horizontal-list-example',
  imports: [RunwayWrapperComponent, FormsModule],
  templateUrl: './runway-horizontal-list.html',
  styleUrls: ['./runway-horizontal-list.scss'],
  encapsulation: ViewEncapsulation.ShadowDom

})
export class RunwayHorizontalListExampleComponent {
  protected readonly runwayWrapper = viewChild<RunwayWrapperComponent>(RunwayWrapperComponent);

  protected readonly columnCount = HORIZONTAL_COUNT;

  // `columns` drives colCount (for orientation="horizontal" the column axis is the item
  // axis). The wrapper applies it to the native element before `items`/`data`.
  protected readonly columns = HORIZONTAL_COUNT;

  // Row data just needs a single placeholder entry: orientation="horizontal" forces
  // rowCount to 1 regardless of array length, and it's only there to trigger registry setup.
  protected readonly placeholderData: null[] = [null];

  protected targetIndex: number = 500;

  protected getLabel(colIndex: number): string {
    return H_LABELS[colIndex % H_LABELS.length];
  }

  protected getColor(colIndex: number): string {
    return H_COLORS[colIndex % H_COLORS.length];
  }

  protected isWide(colIndex: number): boolean {
    return colIndex % 4 === 0;
  }

  protected jumpToIndex(index: number = this.targetIndex): void {
    const target = Number(index);
    if (!isNaN(target)) {
      this.runwayWrapper()?.scrollToCell(0, target);
    }
  }

  protected scrollToStart(): void {
    this.runwayWrapper()?.scrollToCell(0, 0);
  }

  protected scrollToEnd(): void {
    this.runwayWrapper()?.scrollToCell(0, this.columnCount - 1);
  }
}
