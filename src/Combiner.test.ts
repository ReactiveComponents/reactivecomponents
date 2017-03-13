import {Subject, BehaviorSubject} from "rxjs";
import {combine} from "./Combiner";
import {dependent} from "./DependentState";

describe("Combiner", function () {

    it("observeAll has '[undefined, undefined]' state after creation", function (done) {
        const dummy1 = new Subject<number>();
        const dummy2 = new Subject<number>();
        const state1 = dependent(dummy1);
        const state2 = dependent(dummy2);

        let combined = combine(state1, state2);
        combined.observeAll()
                .subscribe(i => {
                    assert.deepEqual(i, [undefined, undefined]);
                    done();
                })
    });

    it("observeNonValues has '[undefined, undefined]' state after creation", function (done) {
        const dummy1 = new Subject<number>();
        const dummy2 = new Subject<number>();
        const state1 = dependent(dummy1);
        const state2 = dependent(dummy2);

        let combined = combine(state1, state2);
        combined.observeNonValues()
                .subscribe(i => {
                    assert.deepEqual(i, [undefined, undefined]);
                    done();
                })
    });

    it("observeNonValues emits values while no all input states have a value", function (done) {
        const dummy1 = new Subject<number>();
        const dummy2 = new Subject<number>();
        const state1 = dependent(dummy1);
        dummy1.next(1);

        const state2 = dependent(dummy2);

        let combined = combine(state1, state2);

        combined.observeAll()
                .subscribe(both => {
                    assert.deepEqual(both, [1, undefined]);
                    done();
                });
    });

    it("observeValues emits values once all input states have a value", function (done) {
        const dummy1 = new Subject<number>();

        const state1 = dependent(dummy1);

        const dummy2 = new Subject<number>();
        const state2 = dependent(dummy2);

        let combined = combine(state1, state2);

        combined.observeValues()
                .subscribe(both => {
                    assert.deepEqual(both, [1, 2]);
                    done();
                });

        dummy1.next(1);
        dummy2.next(2);
    });

    it("combine3", function (done) {
        const state1 = dependent(new BehaviorSubject<number>(1));
        const state2 = dependent(new BehaviorSubject<number>(2));
        const state3 = dependent(new BehaviorSubject<number>(3));
        let combined = combine(state1, state2, state3);
        combined.observeValues()
                .subscribe(all => {
                    assert.deepEqual(all, [1, 2, 3]);
                    done();
                });
    });

    it("combine4", function (done) {
        const state1 = dependent(new BehaviorSubject<number>(1));
        const state2 = dependent(new BehaviorSubject<number>(2));
        const state3 = dependent(new BehaviorSubject<number>(3));
        const state4 = dependent(new BehaviorSubject<number>(4));
        let combined = combine(state1, state2, state3, state4);
        combined.observeValues()
                .subscribe(all => {
                    assert.deepEqual(all, [1, 2, 3, 4]);
                    done();
                });
    });

    it("combine5", function (done) {
        const state1 = dependent(new BehaviorSubject<number>(1));
        const state2 = dependent(new BehaviorSubject<number>(2));
        const state3 = dependent(new BehaviorSubject<number>(3));
        const state4 = dependent(new BehaviorSubject<number>(4));
        const state5 = dependent(new BehaviorSubject<number>(5));
        let combined = combine(state1, state2, state3, state4, state5);
        combined.observeValues()
                .subscribe(all => {
                    assert.deepEqual(all, [1, 2, 3, 4, 5]);
                    done();
                });
    });

});