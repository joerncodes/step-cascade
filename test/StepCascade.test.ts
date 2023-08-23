import StepCascade from "../src/StepCascade";
import MessageStep from "./fixtures/MessageStep";
import ThrowingStep from "./fixtures/ThrowingStep";
import StringArrayPayload from "./fixtures/StringArrayPayload";

describe("StepCascade", () => {
  let payload: StringArrayPayload;
  let cascade: StepCascade<StringArrayPayload>;

    beforeEach(() => {
      payload = { messages: [] };
      cascade = new StepCascade<StringArrayPayload>();
    });

  describe("adding steps", () => {
    it("can add a step to the cascade", async () => {
      const cascade = new StepCascade<StringArrayPayload>();
      const result = await cascade
        .addStep(new MessageStep("Hello world!"))
        .run(payload);
      expect(result.messages[0]).toBe("Hello world!");
    });

    it("can add multiple steps, which can all influence the result", async () => {
      const result = await cascade
        .addStep(new MessageStep("Hello world!"))
        .addStep(new MessageStep("¡Hola mundo!"))
        .run(payload);
      expect(result.messages[0]).toBe("Hello world!");
      expect(result.messages[1]).toBe("¡Hola mundo!");
    });

    it("keeps the order the steps were added in, even if they are alphabetically in a different order", async () => {
      const result = await cascade
        .addStep(new MessageStep("Hello world!"))
        .addStep(new MessageStep("¡Hola mundo!"))
        .run(payload);
      expect(result.messages[0]).toBe("Hello world!");
      expect(result.messages[1]).toBe("¡Hola mundo!");
    });
  });

  describe("error handling", () => {
    const messageStepSpy = jest.spyOn(MessageStep.prototype, "run");

    beforeEach(() => {
        messageStepSpy.mockClear();
    });
    it("will fail if ONE STEP in the cascade fails", async () => {
        cascade
            .addStep(new ThrowingStep("Error"))
            .addStep(new MessageStep("I will never trigger"));

        expect(async () => {
           await cascade.run(payload)
        }).rejects.toThrow();
        expect(messageStepSpy).not.toHaveBeenCalled();
    });
  });
});
