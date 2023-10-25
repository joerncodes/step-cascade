import TStepDescription from "./TStepDescription";

/**
 * Error class that can wrap "normal" errors and provide additional
 * information via the StepDescription.
 *
 * @author Joern Meyer <https://joern.url.lol/🧑‍💻>
 */
export default class StepError<T> extends Error {
  stepDescription: TStepDescription<T>;

  constructor(message: string, stepDescription: TStepDescription<T>) {
    super(message);
    this.stepDescription = stepDescription;
    Object.setPrototypeOf(this, StepError.prototype);
  }
}
