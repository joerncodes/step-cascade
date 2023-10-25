import StepCascade from "../StepCascade";

/**
 * @author Joern Meyer <https://joern.url.lol/🧑‍💻>
 */
export default abstract class AbstractCascadingStep<T> {
  abstract run(stepCascade: StepCascade<T>, payload: T): Promise<T>;

  identifyRecoverableError(error: any): boolean {
    return false;
  }
}
