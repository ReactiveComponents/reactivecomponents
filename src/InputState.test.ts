import {state} from "./InputState";
import {Observable} from "rxjs";

describe("InputState", function () {

    it("is empty after creation", function () {
        const s1 = state();
        assert.isFalse(s1.hasValue());

        s1.forEach(() => {
            throw new Error();
        })
    });

    it("can have an initial value", function (done) {
        const s1 = state(5);
        s1.observeAll().subscribe(i => {
            assert.equal(i, 5);
            done();
        });
    });

    it("replays the initial value on every connect", function () {
        const values: any[] = [];
        const s1 = state(5);
        s1.observeAll().subscribe(i => {
            values.push(i);
        });

        s1.disconnect();
        s1.connect();
        s1.disconnect();
        s1.connect();

        assert.deepEqual(values, [5, 5, 5]);
    });

    it("broadcasts value", function (done) {
        const s1 = state<number>();
        s1.putValue(1);
        s1.observeAll().subscribe(i => {
            assert.equal(i, 1);
            done();
        })
    });

    it("can be cleared", function () {
        const s1 = state(5);
        s1.clear();
        s1.observeValues().subscribe(() => {
            throw new Error("state should be cleared");
        });
    });

    it("can modify the state from a value", function (done) {
        const s1 = state(5);
        s1.doModify(val => val + 1);
        s1.observeValues().subscribe(val => {
            assert.equal(val, 6);
            done();
        });
    });

    it("can modify the state from Observable", function (done) {
        const s1 = state(5);
        s1.doModify(val => Observable.of(val + 1));
        s1.observeValues().subscribe(val => {
            assert.equal(val, 6);
            done();
        });
    });

    it("can modify the state if it has a nonValue", function (done) {
        const s1 = state();

        s1.doModify(() => {
            throw new Error("must not be called");
        }, () => 9);

        s1.observeValues().subscribe(val => {
            assert.equal(val, 9);
            done();
        });
    });

    it("calls doOnValue with inital value of 0", function (done) {
        const s1 = state(0);
        s1.forEach(val => {
            assert.equal(val, 0);
            done();
        })
    });

    it("putFromPromise", function (done) {
        const s1 = state(0);
        s1.putFromPromise(Observable.timer(0).take(1).toPromise());
        assert.isFalse(s1.hasValue());
        s1.forEach(val => {
            assert.equal(val, 0);
            assert.isTrue(s1.hasValue());
            done();
        });
    });

    it("hasActivePromiseRequest", function (done) {
        const s1 = state(0);
        s1.putFromPromise(Observable.timer(0).take(1).toPromise());
        assert.isFalse(s1.hasValue());
        assert.isTrue(s1.hasActivePromiseRequest());

        s1.forEach(val => {
            assert.equal(val, 0);
            assert.isTrue(s1.hasValue());
            assert.isFalse(s1.hasActivePromiseRequest());
            done();
        });
    });

    it("isPristine", function () {
        const s1 = state<number>();
        assert.isTrue(s1.isPristine());
        s1.putFromPromise(Observable.timer(0).take(1).toPromise());
        assert.isFalse(s1.isPristine());
        assert.isFalse(s1.hasValue());
    });

    it("putFromPromiseIfPristine", function (done) {
        const s1 = state<number>();

        s1.putFromPromiseIfPristine(() => Observable.timer(0).take(1).toPromise());
        assert.isTrue(s1.hasActivePromiseRequest());
        assert.isFalse(s1.hasValue());

        s1.putFromPromiseIfPristine(() => {
            throw new Error("must not be called");
        });

        s1.forEach(val => {
            assert.equal(val, 0);
            assert.isTrue(s1.hasValue());
            assert.isFalse(s1.hasActivePromiseRequest());
            done();
        });
    });

});