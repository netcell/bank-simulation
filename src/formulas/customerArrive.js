export const customerArriveProbabilityCreator = ALPHA => timeInSecond => {
  return 1 - Math.exp(-timeInSecond / ALPHA);
};

export const isCustomerArriveCreator = ALPHA => {
  const customerArriveProbability = customerArriveProbabilityCreator(ALPHA);
  return lastCustomerTimestamp => {
    const timeInSecond = (Date.now() - lastCustomerTimestamp) / 1000;
    const probability = customerArriveProbability(timeInSecond);
    return Math.random() <= probability;
  };
};

export const nextCustomerArriveInCreator = ALPHA => {
  const customerArriveProbability = customerArriveProbabilityCreator(ALPHA);
  return () => {
    let seconds = 0;
    let probability = Math.random();
    while (customerArriveProbability(seconds) < probability) {
      seconds += 0.05;
      probability = Math.random();
    }
    return seconds;
  };
};
