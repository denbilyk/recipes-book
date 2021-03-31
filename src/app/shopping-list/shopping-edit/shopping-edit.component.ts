import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', {static: false}) nameInput: ElementRef | undefined;
  @ViewChild('amountInput', {static: false}) amountInput: ElementRef | undefined;

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit(): void {
  }

  onAddIngredient(event: MouseEvent): void {
    event.preventDefault();
    const name = this.nameInput?.nativeElement.value;
    const amount = this.amountInput?.nativeElement.value;
    this.shoppingListService.addIngredient(new Ingredient(name, amount));
  }
}
