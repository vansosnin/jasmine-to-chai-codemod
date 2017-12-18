describe("Base transforms", function() {
    it("handles toThrowError()", function() {
        expect(myFunc).toThrow();
        expect(myFunc).toThrow("Error message");
        expect(myFunc).toThrow(/Error pattern/);
        expect(myFunc).toThrow(TypeError);
        expect(myFunc).toThrow(new TypeError("Error message"));
    });

    it("handles toThrowError()", function() {
        expect(myFunc).toThrowError();
        expect(myFunc).toThrowError("Error message");
        expect(myFunc).toThrowError(/Error pattern/);
        expect(myFunc).toThrowError(TypeError);
        expect(myFunc).toThrowError(new TypeError("Error message"));
        expect(myFunc).toThrowError(TypeError, "Error message");
    });
});
