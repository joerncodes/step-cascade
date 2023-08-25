import StepCascade from "../StepCascade";

export default abstract class AbstractCascadingStep<T> {
  abstract run(stepCascade: StepCascade<T>, payload: T): Promise<T>;
}
