p = {
    fCreate: function(a, b) {
        this.a = a;
        this.b = b;
        return this;
    },
    fChangeA: function(c) {
        this.a = c;
    }
}

sper ={
    fCreate: function() {
        this.p = p.fCreate(10, 20);
        this.e = p.fCreate(30, 40);
        this.p.fChangeA(100);
        return "<p>a: " + this.p.a + "</p><p>b: " + this.p.b + "</p>"  ;
    }
}