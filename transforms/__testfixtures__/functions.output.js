describe("functions transforms", function() {
    it("handles toBe()", function() {
        expect(foo).to.equal(1);
        expect(foo).not.to.equal(2);
    });

    it("handles toEqual()", function() {
        expect(foo).to.deep.equal({foo: "bar"});
        expect(foo).not.to.deep.equal({foo: "baz"});
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
});
