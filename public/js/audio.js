
var matrix2 = [ [0,1,1,1,0,1,0,1],
                [1,0,1,0,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,1,1,0,0,0]];


function SPI(options){
  this.matrix = options.mat;
  this.hitRate = options.hr || 4;
  this.beatRate = options.br || 4;
  this.type = options.type;
  this.main = null;
  this.poly = options.poly||3;

  switch(this.type){
    case 'synth':
      this.main = T("SynthDef", { mul: 0.45, poly: this.poly }).play();
      var rhythmEnv   = T("adsr", { d: 600, s: 0, r: 600 });

      this.main.def = function(opts) {
        var op1 = T("sin", { freq: opts.freq * 3, fb: 0.25, mul: 0.4});
        var op2 = T("saw", { freq: opts.freq, phase: op1, mul: opts.velocity/128 });
        return rhythmEnv.clone().append(op2).on("ended", opts.doneAction).bang();
      };
      break;
    case 'basssynth':
      this.main = T("SynthDef", { mul: 0.45, poly: 3 }).play();
      var bassEnv   = T("adsr", { d: 300, s: 0, r: 600 });

      this.main.def = function(opts) {
        var op1 = T("sin", { freq: opts.freq * 3, fb: 0.25, mul: 0.4});
        var op2 = T("sin", { freq: opts.freq, phase: op1, mul: opts.velocity/128 });
        return bassEnv.clone().append(op2).on("ended", opts.doneAction).bang();
      };
  }
}

SPI.prototype.playNote = function(beat){
  console.log(beat);
  if(beat % this.hitRate == 0) {
    for(var ii = 0; ii < this.matrix[Math.floor(beat / this.beatRate)%8].length; ii++) {
      //if(this.matrix[Math.floor(beat / this.hitRate)%8][ii] == 1){
      if(Math.random()<0.15){
          if(this.main)this.main.noteOn(scale[ii] + 60, 80);
      }
    }
  }
}

var ins1 = new SPI({ 
  hr: 2,
  br: 2,
  mat:[ [1,1,1,1,1,1,1,1],
        [1,0,1,0,0,0,0,0],
        [0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0],
        [1,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,1,0],
        [0,0,0,0,0,1,0,0],
        [0,0,0,0,1,0,0,0]],
  type:'synth',
  poly:1,
 });

var ins2 = new SPI({ 
  hr: 2,
  br: 2,
  mat:[ [1,1,1,1,1,1,1,1],
        [1,0,1,0,0,0,0,0],
        [0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0],
        [1,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,1,0],
        [0,0,0,0,0,1,0,0],
        [0,0,0,0,1,0,0,0]],
  type:'basssynth',
  poly:3
 });


var instruments = [ins1,ins2  ,null,null]


var C  = 0;
var CS = 1;
var D  = 2;
var DS = 3;
var E  = 4;
var F  = 5;
var FS = 6;
var G  = 7;
var GS = 8;
var A  = 9;
var AS = 10;
var B  = 11;

var onScale = 0;
var scales = [[C, D, E, G, A, C + 12, D + 12, E + 12],
              [D, E, G, A, B, D + 12, E + 12, G + 12],
              [A, B, D, E, FS, A + 12, B + 12, D + 12 ],
              [CS, E, FS, A, B, CS + 12, E + 12, FS + 12]];
var scale = scales[0];

timbre.setup({ samplerate: timbre.samplerate * 0.5 });

T("audio").load("/js/libs/timbre/misc/audio/drumkit.wav", function() {
  var BD  = this.slice(   0,  500).set({bang:false, mul:1.3});
  var SD  = this.slice( 500, 1000).set({bang:false});
  var HH1 = this.slice(1000, 1500).set({bang:false, mul:0.2});
  var HH2 = this.slice(1500, 2000).set({bang:false, mul:0.2});
  var CYM = this.slice(2000).set({bang:false, mul:0.2});

  var drum = T("lowshelf", { freq: 150, gain: 5, mul: 0.5 }, BD, SD, HH1, HH2, CYM).play();

  

  

  T("interval", {interval:"BPM64 L16"}, function(count) {
      var i = count % 32;

      HH1.bang();
      if(i % 4 == 0 && i > 0) HH2.bang();
      if(i % 4 == 0 || i > 28) SD.bang();
      if(i % 8 == 0 || (i > 16 && i % 4 == 0)|| (i > 24 && i % 2 == 0) || ( i > 28)) BD.bang();

      for(var ii = 0; ii < instruments.length; ii += 1){
        if(instruments[ii])instruments[ii].playNote(i);
      }


      if(i % 32 == 0){
          scale = scales[onScale]
          onScale += 1;
          if(onScale>=scales.length)onScale = 0;
      }
  }).start();
})


  // var master = synth;
  // var mod    = T("sin", {freq:2, add:3200, mul:800, kr:1});
  // // master = T("eq", {params:{lf:[800, 0.5, -2], mf:[6400, 0.5, 4]}}, master);
  // // master = T("phaser", {freq:mod, Q:2, steps:4}, master);
  // // master = T("delay", { time:"BPM64 L16", fb:0, mix:100}, master);

  // mml0 = "t64 l4 v6 q0 o3 ";
  // mml0 += "cc ee ff g&g ee ddd c2";


  // T("mml", { mml:[mml0] }, synth).on("ended", function() {
  //   this.stop();
  // }).set({ buddies:master }).start();
//});
