describe("functions transforms", function() {
    it("handles toBe()", function() {
        expect(foo).toBe(1);
        expect(foo).not.toBe(2);
    });

    it("handles toEqual()", function() {
        expect(foo).toEqual({foo: "bar"});
        expect(foo).not.toEqual({foo: "baz"});
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
});
