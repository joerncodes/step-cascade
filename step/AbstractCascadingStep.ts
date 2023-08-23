export default abstract class AbstractCascadingStep<T> {
  abstract run(payload: T): Promise<T>;
}
