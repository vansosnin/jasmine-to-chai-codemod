describe("Base transforms", function() {
    it("handles truthy and falsy", function() {
        expect("").toBeFalsy();
        expect(1).toBeTruthy();
        expect({}).not.toBeFalsy();
        expect(0).not.toBeTruthy();
    });

    it("handles undefined", function() {
        expect(undefined).toBeUndefined();
        expect("Hello").toBeDefined();
        expect(1234567).not.toBeUndefined();
        expect(undefined).not.toBeDefined();
    });

    it("handles null", function() {
        expect(null).toBeNull();
        expect(1234).not.toBeNull();
    });

    it("handles toThrowError()", function() {
        expect(myFunc).toThrow();
        expect(myFunc).toThrow("Error message");
        expect(myFunc).toThrow(/Error pattern/);
        expect(myFunc).toThrow(TypeError);
        expect(myFunc).toThrow(new TypeError("Error message"));

        expect(myFunc).not.toThrow();
        expect(myFunc).not.toThrow("Error message");
        expect(myFunc).not.toThrow(/Error pattern/);
        expect(myFunc).not.toThrow(TypeError);
        expect(myFunc).not.toThrow(new TypeError("Error message"));
    });

    it("handles toThrowError()", function() {
        expect(myFunc).toThrowError();
        expect(myFunc).toThrowError("Error message");
        expect(myFunc).toThrowError(/Error pattern/);
        expect(myFunc).toThrowError(TypeError);
        expect(myFunc).toThrowError(new TypeError("Error message"));
        expect(myFunc).toThrowError(TypeError, "Error message");

        expect(myFunc).not.toThrowError();
        expect(myFunc).not.toThrowError("Error message");
        expect(myFunc).not.toThrowError(/Error pattern/);
        expect(myFunc).not.toThrowError(TypeError);
        expect(myFunc).not.toThrowError(new TypeError("Error message"));
        expect(myFunc).not.toThrowError(TypeError, "Error message");
    });
});
