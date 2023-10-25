import TIdentifyRecoverableError from "./TIdentifyRecoverableError";
import AbstractCascadingStep from "./step/AbstractCascadingStep";
import StepError from "./step/StepError";
import TStepDescription from "./step/TStepDescription";

/**
 * The StepCascade is a generic class typed to a specific payload type
 * and can be used to take one payload from one "Step" to the next, producing
 * a collaborative result.
 *
 * @author Joern Meyer <https://joern.url.lol/🧑‍💻>
 */
export default class StepCascade<T> {
  protected currentKey: string | undefined;
  protected stepDescriptions: TStepDescription<T>[] = [];
  protected identifyRecoverableError: TIdentifyRecoverableError = (
    error: any
  ) => {
    return false;
  };

  /**
   * Provide a different function that can identify whether or not an error is recoverable.
   * @param identify TIdentifyRecoverableError
   */
  setIdentifyRecoverableErrorFunction(identify: TIdentifyRecoverableError) {
    this.identifyRecoverableError = identify;
  }

  /**
   * Add a step to the cascade.
   *
   * @param step
   * @returns
   */
  addStep(stepDescription: TStepDescription<T>): StepCascade<T> {
    if (!stepDescription.key) {
      stepDescription.key = stepDescription.step.constructor.name;
    }

    this.stepDescriptions.push(stepDescription);
    return this;
  }

  addStepAfter(
    key: string,
    stepDescription: TStepDescription<T>
  ): StepCascade<T> {
    const index = this.findStepIndex(key);

    if (index !== -1) {
      this.stepDescriptions.splice(index + 1, 0, stepDescription);
    } else {
      throw new Error(`No index found for key '${key}'.`);
    }

    return this;
  }

  addStepBefore(
    key: string,
    stepDescription: TStepDescription<T>
  ): StepCascade<T> {
    const index = this.findStepIndex(key);

    if (index !== -1) {
      this.stepDescriptions.splice(index, 0, stepDescription);
    } else {
      throw new Error(`No index found for key '${key}'.`);
    }

    return this;
  }

  addStepFirst(stepDescription: TStepDescription<T>): StepCascade<T> {
    this.stepDescriptions.unshift(stepDescription);
    return this;
  }

  addStepNext(stepDescription: TStepDescription<T>): StepCascade<T> {
    return this.currentKey
      ? this.addStepAfter(this.currentKey, stepDescription)
      : this.addStepFirst(stepDescription);
  }

  findStepIndex(key: string): number {
    return this.stepDescriptions.findIndex((description) => {
      return key === description.key;
    });
  }

  findStep(key: string): AbstractCascadingStep<T> | undefined {
    const description = this.stepDescriptions.find((description) => {
      return key === description.key;
    });
    if (!description) {
      return;
    }

    return description.step;
  }

  /**
   * Pass the payload to all steps in turn.
   *
   * @param payload
   * @returns
   */
  async run(payload: T): Promise<T> {
    let result: T = payload;
    let shouldRepeat;

    for (const stepDescription of this.stepDescriptions) {
      shouldRepeat = true;
      const { key, step } = stepDescription;
      this.currentKey = key;

      while (shouldRepeat) {
        try {
          result = await step.run(this, result);
          shouldRepeat = false;
        } catch (error: any) {
          const wrappedError = new StepError<T>(error.message, stepDescription);
          if (
            !this.identifyRecoverableError(wrappedError) &&
            !step.identifyRecoverableError(wrappedError)
          ) {
            throw wrappedError;
          }
        }
      }
    }

    return result;
  }
}
