import Timeout from "await-timeout";
import { Signal } from "signals";
import { processingTimeCreator } from "../formulas/processingTime";

export class Teller {
  queue = [];
  isProcessing = false;
  onStartProcessingCustomer = new Signal();
  onFinishedProcessingCustomer = new Signal();

  constructor(type, P, timeScale = 1) {
    this.processingTime = processingTimeCreator(P, type);
    this.timeScale = timeScale;
  }
  process = async customer => {
    const processingTime = this.processingTime(customer.factor);
    this.onStartProcessingCustomer.dispatch(customer, processingTime);

    await Timeout.set((processingTime * 1000) / this.timeScale);

    this.onFinishedProcessingCustomer.dispatch(customer, processingTime);

    if (this.queue.length) {
      customer = this.queue.pop();
      this.process(customer);
    } else {
      this.isProcessing = false;
    }
  };
  handleNewCustomer = async customer => {
    if (!this.isProcessing) {
      this.isProcessing = true;
      this.process(customer);
    } else {
      this.queue.unshift(customer);
    }
  };
}
