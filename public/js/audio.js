var matrix1 = [	[0,1,0,0,0,0,0,0],
				[0,0,1,0,0,0,0,0],
				[0,0,0,1,0,0,0,0],
				[0,0,0,0,1,0,0,0],
				[0,0,0,0,0,1,0,0],
				[0,0,0,0,0,0,1,0],
				[0,0,0,0,0,1,0,0],
				[0,0,0,0,1,0,0,0]]

var matrix2 = [	[1,0,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0]]

// T("audio").load("/js/libs/timbre/drumkit.wav", function() {
// 	var BD  = this.slice(   0,  500).set({bang:false, mul:1.0});
// 	var SD  = this.slice( 500, 1000).set({bang:false});
// 	var HH1 = this.slice(1000, 1500).set({bang:false, mul:0.2});
// 	var HH2 = this.slice(1500, 2000).set({bang:false, mul:0.2});
// 	var CYM = this.slice(2000).set({bang:false, mul:0.2});
//   	var scale = new sc.Scale([0,1,3,7,8], 12, "Pelog");

// 	var drum = T("lowshelf", { freq: 150, gain: 5, mul: 0.5 }, BD, SD, HH1, HH2, CYM).play();
// 	var lead = T("saw", {freq:T("param")});
//   	var vcf  = T("MoogFF", {freq:500, gain:0, mul:0.1}, lead);
//   	var env  = T("perc", {r:100});
//   	var arp  = T("OscGen", {wave:"sin(15)", env:env, mul:0.5});

//   	var P1 = [
// 	    [BD, HH1],
// 	    [HH1],
// 	    [HH2],
// 	    [],
// 	    [BD, SD, HH1],
// 	    [HH1],
// 	    [HH2],
// 	    [SD],
// 	].wrapExtend(128);

// 	var P2 = sc.series(16);

// 	T("interval", {interval:"BPM64 L16"}, function(count) {
// 	    var i = count % 32;

// 	   	var noteNum = scale.wrapAt(P2.wrapAt(count)) + 60;
// 	    if (i % 2 == 0) {
// 	    	if (Math.random() < 1) {
// 	        	var j = (Math.random() * P1.length)|0;
// 	        	P1.wrapSwap(i, j);
// 	        	P2.wrapSwap(i, j);
// 	      	}
// 	      	lead.freq.linTo(noteNum.midicps() * 0.5, "50ms")
// 	    }
// 	    arp.noteOn(noteNum + 24, 60);
// 	}).start();
// });

T("audio").load("/js/libs/timbre/drumkit.wav", function() {
  var BD  = this.slice(   0,  500).set({bang:false});
  var SD  = this.slice( 500, 1000).set({bang:false});
  var HH1 = this.slice(1000, 1500).set({bang:false, mul:0.2});
  var HH2 = this.slice(1500, 2000).set({bang:false, mul:0.2});
  var CYM = this.slice(2000).set({bang:false, mul:0.2});
  var scale = new sc.Scale([0,1,3,7,8], 12, "Pelog");

  var P1 = [
    [BD, HH1],
    [HH1],
    [HH2],
    [],
    [BD, SD, HH1],
    [HH1],
    [HH2],
    [SD],
  ].wrapExtend(128);

  var P2 = sc.series(16);

  var drum = T("lowshelf", {freq:110, gain:8, mul:0.6}, BD, SD, HH1, HH2, CYM).play();
  var lead = T("saw", {freq:T("param")});
  var vcf  = T("MoogFF", {freq:2400, gain:6, mul:0.1}, lead);
  var env  = T("perc", {r:100});
  var arp  = T("OscGen", {wave:"sin(15)", env:env, mul:0.5});

  T("delay", {time:"BPM128 L4", fb:0.65, mix:0.35}, 
    T("pan", {pos:0.2}, vcf), 
    T("pan", {pos:T("tri", {freq:"BPM64 L1", mul:0.8}).kr()}, arp)
  ).play();

  T("interval", {interval:"BPM128 L16"}, function(count) {
    var i = count % 32;

	HH1.bang();
	if(i % 4 == 0) HH2.bang();
	if(i % 4 == 0 || i > 28) SD.bang();
	if(i % 8 == 0 || (i > 16 && i % 4 == 0)|| (i > 24 && i % 2 == 0) || ( i >28)) BD.bang();

    if (Math.random() < 0.015) {
      var j = (Math.random() * 32)|0;
      P1.wrapSwap(i, j);
      P2.wrapSwap(i, j);
    }

    var noteNum = scale.wrapAt(P2.wrapAt(count)) + 60;
    if (i % 2 === 0) {
      lead.freq.linTo(noteNum.midicps() * 2, "100ms");
    }
    arp.noteOn(noteNum + 24, 60);
  }).start();
});