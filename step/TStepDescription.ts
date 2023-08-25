import AbstractCascadingStep from "./AbstractCascadingStep";

type TStepDescription<T> = {
    key?: string;
    step: AbstractCascadingStep<T>;
}
export default TStepDescription;