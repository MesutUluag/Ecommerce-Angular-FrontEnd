import {Component, OnInit} from '@angular/core';
import {ProductService} from 'src/app/services/product.service';
import {Product} from 'src/app/common/product';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousKeyword: string = null;


  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }

  // tslint:disable-next-line:typedef
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  // tslint:disable-next-line:typedef
  handleListProducts() {
    const hasParameterId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasParameterId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId} ,
                pageNumber=${this.thePageNumber}`);

    this.productService.getProductListPaginate2(this.thePageNumber - 1,
      this.thePageSize
    )
      .subscribe(this.processResult());
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  // tslint:disable-next-line:typedef
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;

    this.productService.searchProductListPaginate(this.thePageNumber - 1,
      this.thePageSize, theKeyword).subscribe(this.processResult());
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(tempProduct: Product) {
    console.log(`Adding to Cart: ${tempProduct.name} with price: ${tempProduct.unitPrice}`);

    const theCartItem: CartItem = new CartItem(tempProduct);

    this.cartService.addToChart(theCartItem);
  }
}
