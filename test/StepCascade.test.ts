import StepCascade from "../StepCascade";
import MessageStep from "./fixtures/MessageStep";
import QueueingStep from "./fixtures/QueuingStep";
import ThrowingStep from "./fixtures/ThrowingStep";
import StringArrayPayload from "./fixtures/StringArrayPayload";
import AsyncStep from "./fixtures/AsyncStep";
import RecoverableThrowingStep from "./fixtures/RecoverableThrowingStep";
import TIdentifyRecoverableError from "../TIdentifyRecoverableError";
import StepError from "../step/StepError";
import TRecoverableCallback from "../TRecoverableCallback";

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
        .addStep({ step: new MessageStep("Hello world!") })
        .run(payload);
      expect(result.messages[0]).toBe("Hello world!");
    });

    it("can add multiple steps, which can all influence the result", async () => {
      const result = await cascade
        .addStep({ step: new MessageStep("Hello world!") })
        .addStep({ step: new MessageStep("¡Hola mundo!") })
        .run(payload);
      expect(result.messages[0]).toBe("Hello world!");
      expect(result.messages[1]).toBe("¡Hola mundo!");
    });

    it("keeps the order the steps were added in, even if they are alphabetically in a different order", async () => {
      const result = await cascade
        .addStep({ step: new MessageStep("Hello world!") })
        .addStep({ step: new MessageStep("¡Hola mundo!") })
        .run(payload);
      expect(result.messages[0]).toBe("Hello world!");
      expect(result.messages[1]).toBe("¡Hola mundo!");
    });
  });

  describe("async steps", () => {
    it("will correctly resolve promises", async () => {
      cascade
        .addStep({ step: new AsyncStep("Timer done") })
        .addStep({ step: new MessageStep("Done") });

      const result = await cascade.run(payload);
      expect(result.messages[0]).toBe("Timer done");
      expect(result.messages[1]).toBe("Done");
    });
  });

  describe("addStepAfter()", () => {
    it("can add steps after a certain step", async () => {
      const result = await cascade
        .addStep({ key: "english", step: new MessageStep("Hello world!") })
        .addStep({ key: "spanish", step: new MessageStep("¡Hola mundo!") })
        .addStepAfter("english", {
          key: "japanese",
          step: new MessageStep("こんにちは、世界"),
        })
        .run(payload);

      expect(result.messages[0]).toBe("Hello world!");
      expect(result.messages[1]).toBe("こんにちは、世界");
      expect(result.messages[2]).toBe("¡Hola mundo!");
    });
    it("throws an error if the key can't be found", async () => {
      expect(async () => {
        await cascade.addStepAfter("non-existant", {
          step: new MessageStep("Hello world!"),
        });
      }).rejects.toThrow();
    });
  });

  describe("addStepBefore()", () => {
    it("can add steps before a certain step", async () => {
      const result = await cascade
        .addStep({ key: "english", step: new MessageStep("Hello world!") })
        .addStep({ key: "spanish", step: new MessageStep("¡Hola mundo!") })
        .addStepBefore("english", {
          key: "japanese",
          step: new MessageStep("こんにちは、世界"),
        })
        .run(payload);

      expect(result.messages[0]).toBe("こんにちは、世界");
      expect(result.messages[1]).toBe("Hello world!");
      expect(result.messages[2]).toBe("¡Hola mundo!");
    });

    it("throws an error if the key can't be found", async () => {
      expect(async () => {
        await cascade.addStepBefore("non-existant", {
          step: new MessageStep("Hello world!"),
        });
      }).rejects.toThrow();
    });
  });

  describe("addStepFirst()", () => {
    it("adds a step to the top of the list", async () => {
      const result = await cascade
        .addStep({ step: new MessageStep("Hello world!") })
        .addStepFirst({ step: new MessageStep("¡Hola mundo!") })
        .run(payload);

      expect(result.messages[0]).toBe("¡Hola mundo!");
      expect(result.messages[1]).toBe("Hello world!");
    });
  });

  describe("addStepNext()", () => {
    it("adds a step after the current position in the queue", async () => {
      const result = await cascade
        .addStep({ step: new MessageStep("First message") })
        .addStep({ step: new QueueingStep() })
        .addStep({ step: new MessageStep("Last message") })
        .run(payload);

      expect(result.messages[0]).toBe("First message");
      expect(result.messages[1]).toBe("I am the queueing step.");
      expect(result.messages[2]).toBe("I am the queued step.");
      expect(result.messages[3]).toBe("Last message");
    });

    it("adds the steps first if the queue has not started yet", async () => {
      const result = await cascade
        .addStep({ step: new MessageStep("Second message") })
        .addStepNext({ step: new MessageStep("First message") })
        .run(payload);

      expect(result.messages[0]).toBe("First message");
      expect(result.messages[1]).toBe("Second message");
    });
  });

  describe("error handling", () => {
    describe("normal error handling", () => {
      const messageStepSpy = jest.spyOn(MessageStep.prototype, "run");

      beforeEach(() => {
        messageStepSpy.mockClear();
      });
      it("will fail if ONE STEP in the cascade fails", async () => {
        cascade
          .addStep({ step: new ThrowingStep("Error") })
          .addStep({ step: new MessageStep("I will never trigger") });

        expect(async () => {
          await cascade.run(payload);
        }).rejects.toThrow();
        expect(messageStepSpy).not.toHaveBeenCalled();
      });
      it("will wrap the original error in a StepError", async () => {
        cascade.addStep({ key: "test", step: new ThrowingStep("Error") });
        try {
          await cascade.run(payload);
        } catch (error: any) {
          expect(Object.getPrototypeOf(error)).toBe(StepError.prototype);
          expect(
            (error as StepError<StringArrayPayload>).stepDescription.key
          ).toBe("test");
        }
      });
    });
    describe("recoverable error handling", () => {
      beforeEach(jest.clearAllMocks);
      it("steps can provide a function that identifies recoverable errors", async () => {
        const recoverableThrowingStepSpy = jest.spyOn(
          RecoverableThrowingStep.prototype,
          "run"
        );
        cascade.addStep({ step: new RecoverableThrowingStep("Error") });

        expect(async () => {
          await cascade.run(payload);
        }).rejects.toThrow();
        expect(recoverableThrowingStepSpy).toHaveBeenCalledTimes(2);
      });
      it("the cascade can also provide a function that identifies recoverable errors", async () => {
        const throwingStepSpy = jest.spyOn(ThrowingStep.prototype, "run");

        let i = 0;
        const recover: TIdentifyRecoverableError = () => {
          return i++ == 0;
        };
        cascade.setIdentifyRecoverableErrorFunction(recover);
        cascade.addStep({ step: new ThrowingStep("Error") });

        expect(async () => {
          await cascade.run(payload);
        }).rejects.toThrow();

        expect(throwingStepSpy).toHaveBeenCalledTimes(2);
      });
      it("the cascade can have a callback that gets called when an error is recoverable", async () => {
        let recoverCounter = 0;
        jest.spyOn(RecoverableThrowingStep.prototype, "run");
        cascade.addStep({ step: new RecoverableThrowingStep("Error") });
        const recoverCallback: TRecoverableCallback = async () => {
          recoverCounter++;
          return true;
        };
        cascade.setRecoverableCallback(recoverCallback);

        expect(async () => {
          await cascade.run(payload);
        }).rejects.toThrow();

        expect(recoverCounter).toBe(1);
      });
    });
  });
});
