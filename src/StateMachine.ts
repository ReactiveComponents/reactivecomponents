import {State} from "./State";
import {input, InputState} from "./InputState";
import {IfThen} from "./utils";

export class StateMachine<StateName> {

    private readonly contextSwitch$: InputState<StateName> = input<StateName>();

    public transition(context: StateName) {
        this.contextSwitch$.putValue(context);
    }

    public reset(reason?: string) {
        this.contextSwitch$.clear(reason);
    }

    public stateInContext<T>(context: StateName, cb: State<T>): State<T> {
        return IfThen(this.contextSwitch$, s => s === context, cb);
    }
}
