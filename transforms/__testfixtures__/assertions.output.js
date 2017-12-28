describe("Assertions", function() {
    it("does not transform assertions that aren't connected to expect()", function() {
        hopefor("foo").toBe("foo");
        hopefor("foo").not.toBe("bar");
    });

    it("ignores unknown assertions", function() {
        expect("foo").toLookLike("foobar");
    });

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

    it("handles toBe()", function() {
        expect(foo).to.equal(1);
        expect(foo).not.to.equal(2);
    });

    it("converts toBe(true/false/null/undefined) to more specific checks", function() {
        expect(foo).to.be.true;
        expect(foo).to.be.false;
        expect(foo).not.to.be.null;
        expect(foo).not.to.be.undefined;
    });

    it("handles toEqual()", function() {
        expect(foo).to.deep.equal({foo: "bar"});
        expect(foo).not.to.deep.equal({foo: "baz"});
    });

    it("converts toEqual() with primitives to specific primitive checks", function() {
        expect(foo).to.be.true;
        expect(foo).to.be.false;
        expect(foo).not.to.be.null;
        expect(foo).not.to.be.undefined;
    });

    it("converts toEqual() with plain numbers and strings to non-deep checks", function() {
        expect(foo).to.equal(123);
        expect(foo).not.to.equal("Hello");
    });

    it("converts toEqual(jasmine.any()) to instanceof or type check", function() {
        expect(true).to.be.a("boolean");
        expect("ho").to.be.a("string");
        expect(undefined).not.to.be.a("string");

        expect(() => {}).to.be.an.instanceof(Function);
        expect({}).to.be.an.instanceof(Object);
        expect([]).to.be.an.instanceof(Array);
        expect(new MyClass()).to.be.an.instanceof(MyClass);
        expect(new OtherClass()).not.to.be.an.instanceof(MyClass);
    });

    it("handles toMatch()", function() {
        expect("Hello world").to.match(/Hello/);
        expect("Goodbye").not.to.match(/Hello/);
    });

    it("handles toContain()", function() {
        expect([1, 2, 3]).to.contain(2);
        expect([1, 2, 3]).not.to.contain(4);

        expect("Hello world!").to.contain("world");
        expect("Hello world!").not.to.contain("Goodbye");
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

    it("preserves comments", function() {
        /**
         * larger comment block
         */
        expect(1).to.equal(1); // line comment
        // another line
        expect(2).not.to.equal(1);
        // more
        // in
        // the
        // end
        // ...
    });
});
