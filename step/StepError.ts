import TStepDescription from "./TStepDescription";

export default class StepError<T> extends Error {
  stepDescription: TStepDescription<T>;

  constructor(message: string, stepDescription: TStepDescription<T>) {
    super(message);
    this.stepDescription = stepDescription;
    Object.setPrototypeOf(this, StepError.prototype);
  }
}
