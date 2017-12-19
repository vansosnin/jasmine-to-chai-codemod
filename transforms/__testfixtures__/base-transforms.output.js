describe("Base transforms", function() {
    it("handles truthy and falsy", function() {
        expect("").not.to.be.ok;
        expect(1).to.be.ok;
        expect({}).to.be.ok;
        expect(0).not.to.be.ok;
    });

    it("handles undefined", function() {
        expect(undefined).to.be.undefined;
        expect("Hello").not.to.be.undefined;
        expect(1234567).not.to.be.undefined;
        expect(undefined).to.be.undefined;
    });

    it("handles null", function() {
        expect(null).to.be.null;
        expect(1234).not.to.be.null;
    });

    it("handles toThrowError()", function() {
        expect(myFunc).to.throw();
        expect(myFunc).to.throw("Error message");
        expect(myFunc).to.throw(/Error pattern/);
        expect(myFunc).to.throw(TypeError);
        expect(myFunc).to.throw(TypeError, "Error message");

        expect(myFunc).not.to.throw();
        expect(myFunc).not.to.throw("Error message");
        expect(myFunc).not.to.throw(/Error pattern/);
        expect(myFunc).not.to.throw(TypeError);
        expect(myFunc).not.to.throw(TypeError, "Error message");
    });

    it("handles toThrowError()", function() {
        expect(myFunc).to.throw(Error);
        expect(myFunc).to.throw("Error message");
        expect(myFunc).to.throw(/Error pattern/);
        expect(myFunc).to.throw(TypeError);
        expect(myFunc).to.throw(TypeError, "Error message");
        expect(myFunc).to.throw(TypeError, "Error message");

        expect(myFunc).not.to.throw(Error);
        expect(myFunc).not.to.throw("Error message");
        expect(myFunc).not.to.throw(/Error pattern/);
        expect(myFunc).not.to.throw(TypeError);
        expect(myFunc).not.to.throw(TypeError, "Error message");
        expect(myFunc).not.to.throw(TypeError, "Error message");
    });
});
