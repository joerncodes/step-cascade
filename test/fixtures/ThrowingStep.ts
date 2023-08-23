import AbstractCascadingStep from "../../step/AbstractCascadingStep";
import StringArrayPayload from "./StringArrayPayload";

export default class ThrowingStep extends AbstractCascadingStep<StringArrayPayload> {
  private message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  async run(payload: StringArrayPayload): Promise<StringArrayPayload> {
    throw new Error(this.message);
  }
}
