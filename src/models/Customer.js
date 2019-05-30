import { Signal } from "signals";
import {
  isCustomerArriveCreator,
  nextCustomerArriveInCreator
} from "../formulas/customerArrive";

export class Customer {
  constructor(type, index = 0) {
    this.index = index + 1;
    this.type = type;
    this.factor = Math.random();
    this.arrivedAt = Date.now();
  }
}

export class CustomerCreator {
  onNewCustomer = new Signal();
  constructor(type, ALPHA, timeScale = 1) {
    this.type = type;
    this.timeScale = timeScale;
    this.isCustomerArrive = isCustomerArriveCreator(ALPHA);
    this.nextCustomerArriveIn = nextCustomerArriveInCreator(ALPHA);
    this.lastCustomer = new Customer(type, -1);
  }
  createCustomer = () => {
    const lastCustomer = this.lastCustomer;

    const customer = new Customer(this.type, lastCustomer.index);
    this.lastCustomer = customer;
    this.onNewCustomer.dispatch(customer);

    const nextCustomerArriveIn = this.nextCustomerArriveIn();
    this.interval = setTimeout(
      this.createCustomer,
      (nextCustomerArriveIn * 1000) / this.timeScale
    );
  };
  start = () => {
    this.stop();
    this.createCustomer();
  };
  stop = () => {
    this.interval && clearTimeout(this.interval);
  };
}
