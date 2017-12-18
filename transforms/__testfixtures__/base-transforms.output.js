describe("Base transforms", function() {
    it("handles toThrowError()", function() {
        expect(myFunc).to.throw();
        expect(myFunc).to.throw("Error message");
        expect(myFunc).to.throw(/Error pattern/);
        expect(myFunc).to.throw(TypeError);
        expect(myFunc).to.throw(TypeError, "Error message");
    });

    it("handles toThrowError()", function() {
        expect(myFunc).to.throw(Error);
        expect(myFunc).to.throw("Error message");
        expect(myFunc).to.throw(/Error pattern/);
        expect(myFunc).to.throw(TypeError);
        expect(myFunc).to.throw(TypeError, "Error message");
        expect(myFunc).to.throw(TypeError, "Error message");
    });
});
