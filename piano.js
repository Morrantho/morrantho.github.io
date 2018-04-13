const ENTS = {};
const WHITE_KEYS="qetyip]";
const BLACK_KEYS="wruo[";
const NATURALS="CDEFGAB";
const SHARPS="C#D#F#G#A#";

function Canvas(){
	let canvas = document.getElementById("canvas");
	let prev = new Date().getTime(),cur,delta
	const TICKRATE = 1000/16.66666666;
	const CONTEXT = canvas.getContext("2d");

	canvas.addEventListener("keydown",(e)=>{
		if(ENTS[e.key])
			if(!ENTS[e.key].pressed && ENTS[e.key].audio){
				ENTS[e.key].pressed = true;
				ENTS[e.key].audio.play();
			}
	});

	canvas.addEventListener("keyup",(e)=>{
		if(ENTS[e.key])
			if(ENTS[e.key].pressed && ENTS[e.key].audio){
				ENTS[e.key].pressed = false;
				ENTS[e.key].audio.pause();
				ENTS[e.key].audio.currentTime = 0;
			}
	});
	canvas.focus();

	this.run=()=>{
		cur = new Date().getTime();

		if(cur-prev >= TICKRATE){
			this.tick(cur-prev);
			prev = new Date().getTime();
		}
		this.render(CONTEXT);
		window.requestAnimationFrame(this.run);
	}

	this.clear=(g)=>{
		canvas.width=window.innerWidth;
		canvas.height=window.innerHeight;

		g.fillStyle="rgb(0,100,200)";
		g.fillRect(0,0,canvas.width,canvas.height);
	}

	this.tick=(t)=>{
		for(let ent in ENTS){
			ENTS[ent].tick(t);
		}
	}

	this.render=(g)=>{
		this.clear(g);

		for(let ent in ENTS){
			ENTS[ent].render(g);
		}
	}

	initKeys();
}

function Key(x,y,w,h,col,key,note){
	this.key=key;
	this.audio=document.getElementById(note);
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
	this.col=col;
	this.activeCol="rgb(255,0,255)";
	this.bgCol="rgb(0,0,0)";
	this.pressed=false;

	this.tick=(t)=>{

	}

	this.render=(g)=>{
		g.strokeStyle=this.bgCol;

		if(this.pressed){
			g.fillStyle=this.activeCol;
		}else{
			g.fillStyle=col;
		}
		g.fillRect(x,y,w,h);
		g.strokeRect(x,y,w,h);
	}

	ENTS[key] = this;
}

function initKeys(){
	for(let i=0,j=64;i<WHITE_KEYS.length;i++,j+=64-16){
		new Key(j,64,48,256,"rgb(255,255,255)",WHITE_KEYS[i],NATURALS[i]);
	}

	let sharp = "";

	for(let i=0,j=96,k=0;i<BLACK_KEYS.length;i++,j+=64-16,k+=2){
		sharp += SHARPS[k]+SHARPS[k+1];

		if(i == 2){
			j+=48;

			new Key(j,64,32,196,"rgb(0,0,0)",BLACK_KEYS[i],sharp);
		}else{
			new Key(j,64,32,196,"rgb(0,0,0)",BLACK_KEYS[i],sharp);
		}

		sharp="";
	}

}

let canvas = new Canvas();
window.requestAnimationFrame(canvas.run);
