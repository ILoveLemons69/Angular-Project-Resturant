import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IResponse, RestaurntService } from '../services/restaurnt-service';

@Component({
  selector: 'app-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter {
  private service = inject(RestaurntService);
  private fb = inject(FormBuilder);

  public page = input.required<number>();
  public isFiltered = input.required<boolean>();

  public filteredProducts = output<IResponse>();
  public isFilteredSignal = output<boolean>();

  public filterForm = this.fb.group({
    query: this.fb.control('', []),
    vegetarian: this.fb.control(undefined, []),
    spiciness: this.fb.control<number | undefined>(undefined, [Validators.min(0)]),
    rate: this.fb.control<number | undefined>(undefined, [Validators.min(0), Validators.max(5), Validators.pattern(/^\d+(\.\d+)?$/)]),
    minPrice: this.fb.control<number | undefined>(undefined, [Validators.min(0), Validators.pattern(/^\d+(\.\d+)?$/)]),
    maxPrice: this.fb.control<number | undefined>(undefined, [Validators.min(0), Validators.pattern(/^\d+(\.\d+)?$/)]),
    categoryId: this.fb.control(undefined, []),
  });

  constructor() {
    effect(() => {
      if (this.isFiltered()) {
        this.submit();
      }
    });
  }

  submit() {
    if (this.filterForm.invalid) {
      return;
    }

    this.service
      .getFiltered({
        query: this.filterForm.controls.query.value ?? '',
        vegetarian: this.filterForm.controls.vegetarian.value ?? undefined,
        spiciness: this.filterForm.controls.spiciness.value ?? undefined,
        rate: this.filterForm.controls.rate.value ?? undefined,
        minPrice: this.filterForm.controls.minPrice.value ?? undefined,
        maxPrice: this.filterForm.controls.maxPrice.value ?? undefined,
        categoryId: this.filterForm.controls.categoryId.value ?? undefined,
        take: 10,
        page: this.page() ?? undefined,
      })
      .subscribe({
        next: (data) => {
          this.filteredProducts.emit(data);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  clearFilter() {
    this.filterForm.patchValue({
      query: '',
      vegetarian: undefined,
      spiciness: undefined,
      rate: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      categoryId: undefined,
    });

    this.isFilteredSignal.emit(false);
  }
}
