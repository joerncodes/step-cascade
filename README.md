# StepCascade

This is a small collection of classes which can be used to build a chain of "steps" all manipulating a common payload object.

## Usage

Let's say we have a payload like this:

```typescript
type User = {
    firstname: string;
    lastname: string;
}
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
    .addStep(new FirstnameStep())
    .addStep(new LastnameStep());

const result = await cascade.run({} as User);

console.log(result.firstname); // Solaire
console.log(result.lastname); // of Astora 

```