import ThrowingStep from "./ThrowingStep";

export default class RecoverableThrowingStep extends ThrowingStep {
  private i = 0;

  identifyRecoverableError(error: any): boolean {
    return this.i++ == 0;
  }
  
  reset() {
    this.i = 0;
  }
}
