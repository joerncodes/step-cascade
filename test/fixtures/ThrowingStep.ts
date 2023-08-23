import AbstractCascadingStep from "../../src/step/AbstractCascadingStep";
import StringArrayPayload from "./StringArrayPayload";

export default class ThrowingStep extends AbstractCascadingStep<StringArrayPayload> {
  private message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  run(payload: StringArrayPayload): StringArrayPayload {
    throw new Error(this.message);
  }
}
