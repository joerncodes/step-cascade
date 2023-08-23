import AbstractCascadingStep from "../../src/step/AbstractCascadingStep";
import StringArrayPayload from "./StringArrayPayload";

export default class MessageStep extends AbstractCascadingStep<StringArrayPayload> {
  private message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  run(payload: StringArrayPayload): StringArrayPayload {
    payload.messages.push(this.message);
    return payload;
  }
}
