describe("Base transforms", function() {
    it("handles truthy and falsy", function() {
        expect("").not.to.be.ok;
        expect(1).to.be.ok;
    });

    it("handles undefined", function() {
        expect(undefined).to.be.undefined;
        expect("Hello").to.not.be.undefined;
    });

    it("handles null", function() {
        expect(null).to.be.null;
    });

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
