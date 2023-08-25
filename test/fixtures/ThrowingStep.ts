/* eslint-disable @typescript-eslint/no-unused-vars */
import StepCascade from "../../StepCascade";
import AbstractCascadingStep from "../../step/AbstractCascadingStep";
import StringArrayPayload from "./StringArrayPayload";

export default class ThrowingStep extends AbstractCascadingStep<StringArrayPayload> {
  private message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  run(
    stepCascade: StepCascade<StringArrayPayload>,
    payload: StringArrayPayload
  ): Promise<StringArrayPayload> {
    throw new Error(this.message);
  }
}
