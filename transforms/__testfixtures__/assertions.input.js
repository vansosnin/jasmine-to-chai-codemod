describe("Assertions", function() {
    it("does not transform assertions that aren't connected to expect()", function() {
        hopefor("foo").toBe("foo");
        hopefor("foo").not.toBe("bar");
    });

    it("ignores unknown assertions", function() {
        expect("foo").toLookLike("foobar");
    });

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

    it("handles toBe()", function() {
        expect(foo).toBe(1);
        expect(foo).not.toBe(2);
    });

    it("handles toEqual()", function() {
        expect(foo).toEqual({foo: "bar"});
        expect(foo).not.toEqual({foo: "baz"});
    });

    it("converts toEqual(jasmine.any()) to instanceof or type check", function() {
        expect(true).toEqual(jasmine.any(Boolean));
        expect("ho").toEqual(jasmine.any(String));
        expect(undefined).not.toEqual(jasmine.any(String));

        expect(() => {}).toEqual(jasmine.any(Function));
        expect({}).toEqual(jasmine.any(Object));
        expect([]).toEqual(jasmine.any(Array));
        expect(new MyClass()).toEqual(jasmine.any(MyClass));
        expect(new OtherClass()).not.toEqual(jasmine.any(MyClass));
    });

    it("handles toMatch()", function() {
        expect("Hello world").toMatch(/Hello/);
        expect("Goodbye").not.toMatch(/Hello/);
    });

    it("handles toContain()", function() {
        expect([1, 2, 3]).toContain(2);
        expect([1, 2, 3]).not.toContain(4);

        expect("Hello world!").toContain("world");
        expect("Hello world!").not.toContain("Goodbye");
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
