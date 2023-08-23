import AbstractCascadingStep from "../../step/AbstractCascadingStep";
import StringArrayPayload from "./StringArrayPayload";

export default class AsyncStep extends AbstractCascadingStep<StringArrayPayload> {
    private message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }

    run(payload: StringArrayPayload): Promise<StringArrayPayload> {
        return new Promise((resolve) => {
            setTimeout(() => {
                payload.messages.push(this.message);
                resolve(payload);
            }, 100)
        });
    }
}