# StepCascade <!-- omit in toc -->

This is a small collection of classes which can be used to build a chain of "steps" all manipulating a common payload object.

## Table of Contents <!-- omit in toc -->

- [Usage](#usage)
  - [Error Handling](#error-handling)
    - [Recoverable Errors by Step](#recoverable-errors-by-step)
    - [Recoverable Errors by Cascade](#recoverable-errors-by-cascade)
    - [Recoverable Callbacks](#recoverable-callbacks)
- [Testing](#testing)
- [Contribution](#contribution)

## Usage

Let's say we have a payload like this:

```typescript
type User = {
  firstname: string;
  lastname: string;
};
```

Then we can write steps that are typed to this payload:

```typescript
class FirstnameStep extends AbstractCascadingStep<User> {
  run(payload: StringArrayPayload): StringArrayPayload {
    payload.firstname = "Solaire";
    return payload;
  }
}

class LastnameStep extends AbstractCascadingStep<User> {
  run(payload: StringArrayPayload): StringArrayPayload {
    payload.lastname = "of Astora";
    return payload;
  }
}
```

We can then use the StepCascade to add those steps and have them manipulate the payload:

```typescript
const cascade = new StepCascade<User>()
  .addStep({ step: new FirstnameStep() })
  .addStep({ step: new LastnameStep() });

const result = await cascade.run({} as User);

console.log(result.firstname); // Solaire
console.log(result.lastname); // of Astora
```

### Error Handling

The default error handling behaviour is quite simple. If one of your steps throws an error, the rest of the steps don't get executed.

```typescript
const cascade = new StepCascade<User>()
  .addStep({ step: new ErrorCausingStep() })
  .addStep({ step: new LastnameSTep() }); // Will never get called
```

The error being thrown by the `StepCascade` will be wrapped in a `StepError`, which will include the current `StepDescription`.

However, you can identify **recoverable errors**, ie. errors that can be resolved by different user input, for example. If a recoverable error gets identified, the step will try again.

There are two possibilities of identifying recoverable errors.

#### Recoverable Errors by Step

`AbstractCascadingStep` provides a function `identifyRecoverableError`. If an error gets thrown while executing this step, the function will be called. If it returns `true`, the step will be repeated.


#### Recoverable Errors by Cascade

Alternatively, you can call the function `setIdentifyRecoverableErrorFunction` on the `StepCascade`:

```typescript
const recover: TIdentifyRecoverableError = (error: any) => {
  return error.message = "A certain error message";
}
stepCascade.setIdentifyRecoverableErrorFunction(recover);
```

If the function returns true, the `StepCascade` will retry the current step, regardless of *which* step it is.

#### Recoverable Callbacks

If the error is recoverable, the `StepCascade` will call a callback function you can provide with the `setRecoverableCallback` function. This is typically used to ask the user if they want to try again.

```typescript
stepCascade.setRecoverableCallback((error: any) => {
  console.log("An error occured, do you want to try again?");
  /* user input */
});
```

## Testing

Simply run "npm test".

## Contribution

Pull Requests are more than welcome!
