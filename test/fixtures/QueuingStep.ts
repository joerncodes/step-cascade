import StepCascade from "../../StepCascade";
import AbstractCascadingStep from "../../step/AbstractCascadingStep";
import MessageStep from "./MessageStep";
import StringArrayPayload from "./StringArrayPayload";

export default class QueueingStep extends AbstractCascadingStep<StringArrayPayload> {
  async run(stepCascade: StepCascade<StringArrayPayload>, payload: StringArrayPayload): Promise<StringArrayPayload> {
    payload.messages.push("I am the queueing step.");
    stepCascade.addStepNext({ step: new MessageStep("I am the queued step.") });

    return payload;
  }
}
