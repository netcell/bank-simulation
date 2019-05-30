export const betaDistributionCreator = (P, alpha, beta) => factor => {
  return P * Math.pow(factor, alpha - 1) * Math.pow(1 - factor, beta - 1);
};

const PROCESSING_TIME_PARAMS = {
  yellow: [2, 5],
  red: [2, 2],
  blue: [5, 1]
};

export const processingTimeCreator = (P, type) => {
  return betaDistributionCreator(P, ...PROCESSING_TIME_PARAMS[type]);
};
