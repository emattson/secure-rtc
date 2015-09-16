describe('simple-rtc', function() {
  it('should test', function() {
    expect(true).to.be.equal(true);

    var spy = sinon.spy();
    spy(1, '1');
    console.log(spy);
    //debugger;
  });
});