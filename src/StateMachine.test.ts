import {input} from "./InputState";
import {State} from "./State";
import {IfThen} from "./utils";
import {StateMachine} from "./StateMachine";

describe("StateMachine", function () {

    it("switching", function () {
        const automata = new StateMachine<"Init" | "Phase1">();


        // switch and value to process differently based on the switch
        const value = input("result");

        // Output states of value when matching substate is active
        const whenInit = automata.stateInContext("Init", value);
        const whenPhase1 = automata.stateInContext("Phase1", value);

        // Initialized with <no value>, so neither stream is active
        assert.isFalse(whenInit.hasValue());
        assert.isFalse(whenPhase1.hasValue());

        // Test: switch to valid substate
        automata.transition("Init");

        // Invalid substate will yield TS error
        // automata.switch("Unknown"); will result in TS error


        // No subscribers -> no downstream values
        assert.isFalse(whenInit.hasValue());
        assert.isFalse(whenPhase1.hasValue());

        whenInit.changes$().subscribe();
        whenPhase1.changes$().subscribe();

        assert.isTrue(whenInit.hasValue());
        assert.isFalse(whenPhase1.hasValue());

        // Test: switch to Phase1
        automata.transition("Phase1");
        assert.isFalse(whenInit.hasValue());
        assert.isTrue(whenPhase1.hasValue());

        // Reset substate
        automata.reset();
        assert.isFalse(whenInit.hasValue());
        assert.isFalse(whenPhase1.hasValue());

    });

});
