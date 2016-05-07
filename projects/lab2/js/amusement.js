//Function created by By William Bontrager @ web-source.net
function CurrencyFormatted(amount)
{
    var i = parseFloat(amount);
    if(isNaN(i)) { i = 0.00; }
    var minus = '';
    if(i < 0) { minus = '-'; }
    i = Math.abs(i);
    i = parseInt((i + .005) * 100);
    i = i / 100;
    s = new String(i);
    if(s.indexOf('.') < 0) { s += '.00'; }
    if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
    s = minus + s;
    return s;
}
/////////////////////////////////////////////////////////////


//display data from amusement global var in console

var amuse = amusement;
for (var a in amuse) {
    console.log(a + ": " + amuse[a]);
}

//Name of 1st Amusement park
var firstRide = amuse[0].name;
console.log("The first ride is " + firstRide);

//All days the 2nd attraction is open
var secondAttDays=amuse[1].open;

for (var i=0; i<secondAttDays.length; i++) {
    console.log(secondAttDays[i] + "<br />")
}

//1st item of lisy of opening days for 2nd attraction
console.log(secondAttDays[0]);

//50% discount for 3rd attr
var thirdPrice=amuse[2].price;
thirdPrice=CurrencyFormatted(thirdPrice);

var discounted_price=thirdPrice/2;
console.log("Discount price: " + discounted_price);

//ACTIVITY 2
var amuse = amusement;
function doublePrices(amuse) {
    for (var i=0; i<amuse.length; i++) {
        var current_price=amuse[i].price;
        current_price=CurrencyFormatted(current_price);
        var double_price=current_price * 2;

        amuse[i].price=double_price;
        console.log("Double Price: " + double_price + "<br />");
    }
}

var amusementRides=doublePrices(amuse);

//#2.
var modAmuse = "";
modAmuse = amusement;
//doubling all prices except for 2nd item
var p_info="";
function newDoublePrices(modAmuse) {
    var double_price = "";

    for (var i = 0; i < modAmuse.length; i++) {
        var current_price = modAmuse[i].price;

        if (i == 1) {
            double_price = current_price;
            p_info="Original Price";
        } else {
            double_price = current_price * 2;
            p_info = "Doubled price";
            modAmuse[i].price = double_price;
        }

        return modAmuse;
        console.log(p_info + ": " + double_price);

    }
}
var amusementRides=newDoublePrices(modAmuse);
alert(amusementRides);
//#3.
function debugAmusementRides(amusementRides) {
    for (var i=0; i<amusementRides.length; i++) {

        var name="Name: " + amusementRides[i].name + "<br />";
        var price="Price: " + amusementRides[i].price + "<br /><br />";
        console.log(name + price);
    }
}

var modifiedData=debugAmusementRides(amusementRides);

//#4.
//lab2.html


//ACTIVITY III
//index.html & lab2.js