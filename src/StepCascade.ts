import AbstractCascadingStep from "./step/AbstractCascadingStep";

/**
 * The StepCascade is a generic class typed to a specific payload type
 * and can be used to take one payload from one "Step" to the next, producing
 * a collaborative result.
 * 
 * @author Joern Meyer <https://joern.url.lol/🧑‍💻>
 */
export default class StepCascade<T> {
  protected steps: AbstractCascadingStep<T>[] = [];

  /**
   * Add a step to the cascade.
   * 
   * @param step 
   * @returns 
   */
  addStep(step: AbstractCascadingStep<T>): StepCascade<T> {
    this.steps.push(step);
    return this;
  }

  /**
   * Pass the payload to all steps in turn.
   * 
   * @param payload 
   * @returns 
   */
  async run(payload: T): Promise<T> {
    let result: T = payload;

    this.steps.forEach((step) => {
      result = step.run(result);
    });

    return result;
  }
}
