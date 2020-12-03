import {Injectable} from '@angular/core';
import {CartItem} from '../common/cart-item';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  // subject is a subclass of observable, the event will be sent to all subscribers
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  addToChart(theCartItem: CartItem) {
    let alreadyExistsInChart: boolean = false;
    let existingCartItem: CartItem = undefined;
    if (this.cartItems.length > 0) {

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // refactored below shown code to upper shown code
      // for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }
    }
    alreadyExistsInChart = (existingCartItem != undefined);
    if (alreadyExistsInChart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }
    this.computeTotals();
  }

  constructor() {
  }

  computeTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values, all subscribers will receive the new date
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  decrementQuantity(tempCartItem: CartItem) {
    tempCartItem.quantity--;
    if (tempCartItem.quantity == 0) {
      this.remove(tempCartItem);
    } else {
      this.computeTotals();
    }
  }

  remove(tempCartItem: CartItem) {
    const cartItemIndex = this.cartItems.find(cartItem => tempCartItem.id === cartItem.id);
    this.cartItems.splice(+cartItemIndex, 1);
    this.computeTotals();
  }
}
