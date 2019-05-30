import { useEffect, useState } from "react";
import { Teller } from "./models/Teller";
import { CustomerCreator } from "./models/Customer";
import { useStats } from "./models/Observer";

export const useBank = (type, P, ALPHA, timeScale = 1) => {
  const [customerCreator, setCustomerCreator] = useState(
    new CustomerCreator(type, ALPHA)
  );
  const [teller, setTeller] = useState(new Teller(type, P));

  useEffect(() => {
    console.log(
      "Init Customer Creator & Teller with type",
      type,
      ", P =",
      P,
      ", ALPHA = ",
      ALPHA
    );

    const newCustomerCreator = new CustomerCreator(type, ALPHA, timeScale);
    const newTeller = new Teller(type, P, timeScale);

    setCustomerCreator(newCustomerCreator);
    setTeller(newTeller);

    newCustomerCreator.onNewCustomer.add(newTeller.handleNewCustomer);

    return () => {
      newCustomerCreator.onNewCustomer.remove(newTeller.handleNewCustomer);
      newCustomerCreator.stop();
    };
  }, [type, P, ALPHA, timeScale]);

  return [customerCreator, teller];
};

const useLog = () => {
  const [logs, setLogs] = useState([]);
  const addLog = log => {
    setLogs(logs => [log, ...logs]);
  };
  return [logs, addLog];
};

export const useObserver = (timeScale = 1) => {
  const [queueLengths, setQueueLength] = useStats();
  const [waitTimes, setWaitTime] = useStats();

  const [logs, addLog] = useLog();
  const [tellerLogs, addTellerLog] = useLog();

  const setTargets = (customerCreator, teller) => {
    if (!customerCreator || !teller) return null;

    const handleNewCustomer = customer => {
      setQueueLength(queueLengths => queueLengths.lastValue + 1);
      addLog(`Customer ${customer.index} arrived`);
    };

    const handleStartProccesingCustomer = (customer, processingTime) => {
      setQueueLength(queueLengths => Math.max(0, queueLengths.lastValue - 1));
      const waitTime = (Date.now() - customer.arrivedAt) * timeScale;
      addTellerLog(
        `Customer ${
          customer.index
        } is being proccessed. Duration: ${processingTime.toFixed(2)}s`
      );
      setWaitTime(() => waitTime);
    };

    const handleFinishedProcessingCustomer = (customer, processingTime) => {
      addTellerLog(`Customer ${customer.index} has been proccessed.`);
    };

    customerCreator.onNewCustomer.add(handleNewCustomer);
    teller.onStartProcessingCustomer.add(handleStartProccesingCustomer);
    teller.onFinishedProcessingCustomer.add(handleFinishedProcessingCustomer);

    return () => {
      customerCreator.onNewCustomer.remove(handleNewCustomer);
      teller.onStartProcessingCustomer.remove(handleStartProccesingCustomer);
      teller.onFinishedProcessingCustomer.remove(
        handleFinishedProcessingCustomer
      );
    };
  };

  return [queueLengths, waitTimes, setTargets, logs, tellerLogs];
};
