import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormsService} from '../../services/form-builder.service';
import {ValidationService} from '../../services/form-builder-validation.service';

/**
 * Form Builder Wrapper
 * Component accepts pageItems and pageValues for From Builder to process
 * and it emits form data to it's parent component.
 */

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html'
})

export class FormBuilderComponent implements OnChanges {

  constructor(
    private formsService: FormsService,
    private validationService: ValidationService) {}

  @Input() pageItems: any;
  @Input() pageValues: any;
  @Input() isPageValid: boolean;
  @Output() submitPage = new EventEmitter<FormGroup>();

  formDraft: FormGroup;
  isLegendAvailable: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    this.isLegendAvailable = false;
    if (changes.pageItems && changes.pageItems.currentValue) {
      this.createForm();
    }
    if (this.pageItems && this.pageItems.groups) {
      for (const group of this.pageItems.groups) {
        if (group.fieldset) {
          for(const item of group.fieldset)
          if (item.legend) {
            this.isLegendAvailable = true;
            break;
          }
        }
      }
    }
  }

  createForm() {
    this.formDraft = new FormGroup(this.formsService.defineformControls(this.pageItems, this.pageValues));
    this.setValidators();
  }

  setValidators(): void {
    if (this.pageItems) {
      const formGroupValidators = this.validationService.createFormGroupValidators(this.formDraft, this.pageItems.formGroupValidators);
      this.formDraft.setValidators(formGroupValidators);
    }
  }

  onFormSubmit() {
    this.submitPage.emit(this.formDraft);
  }
}
