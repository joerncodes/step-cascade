import TStepDescription from "./TStepDescription";

/**
 * Error class that can wrap "normal" errors and provide additional
 * information via the StepDescription.
 *
 * @author Joern Meyer <https://joern.url.lol/🧑‍💻>
 */
export default class StepError<T> extends Error {
  stepDescription: TStepDescription<T>;
  originalError: Error;

  constructor(message: string, originalError: Error, stepDescription: TStepDescription<T>) {
    super(message);
    this.stepDescription = stepDescription;
    this.originalError = originalError;
    Object.setPrototypeOf(this, StepError.prototype);
  }
}
