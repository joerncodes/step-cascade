export default abstract class AbstractCascadingStep<T> {
  abstract run(payload: T): T;
}
