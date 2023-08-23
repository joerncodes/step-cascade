import AbstractCascadingStep from "../../step/AbstractCascadingStep";
import StringArrayPayload from "./StringArrayPayload";

export default class MessageStep extends AbstractCascadingStep<StringArrayPayload> {
  private message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  async run(payload: StringArrayPayload): Promise<StringArrayPayload> {
    payload.messages.push(this.message);
    return payload;
  }
}
