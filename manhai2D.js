//DEVELOPED BY LI WEN, LEADER OF MANHAI-PICTURES 2018-2020
//@MANHAI-PICTURES COPYRIGHT
	
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.Manhai2D = {}));
}(this, (function (exports) { 'use strict';

	const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
								  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
								  
	const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
	
	//--------------------------------------------------------The ArrayList
	
	function ArrayList(dataType)
	{
		this.type = "arraylist";
		this.dataType = dataType || null;
		this.LIST = [];
	}
	
	Object.assign( ArrayList.prototype, {
		
		add: function(element)
		{
			if(this.dataType!=null && typeof(element) == this.dataType)
			{
				this.LIST.push(element);
			}
			else if(this.dataType == null)
			{
				this.LIST.push(element);
			}
			else
			{
				console.log("cannot convert "+typeof(element)+" to "+this.dataType);
			}
		},
		
		remove: function(id)
		{
			if(typeof(id) == "number")
			{
				this.LIST.splice(id,1);
			}
			else
			{
				this.LIST(this.LIST.indexOf(id), 1);
			}
		},
		
		clear: function()
		{
			this.LIST.splice(0, this.LIST.length);
		},
		
		set: function(id, element)
		{
			if(this.dataType!=null && typeof(element) == this.dataType)
			{
				this.LIST[id] = element;
			}
			else if(this.dataType == null)
			{
				this.LIST[id] = element;
			}
			else
			{
				console.log("cannot convert "+typeof(element)+" to "+this.dataType);
			}
		},
		
		get: function(id)
		{
			return this.LIST[id];
		},
		
		size: function()
		{
			return this.LIST.length;
		},
		
		isEmpty: function()
		{
			if(this.LIST.length == 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		},
		
		search: function(elem)
		{		
			return this.LIST.includes(elem);
		},
		
		sort: function(type)
		{
		
			//Only for number and letter
			if(type.toLowerCase() == "ascending")
			{
				if(typeof(this.LIST[0]) == "number")
				{
					this.LIST.sort(function(a, b){return a - b});
				}
				else if(typeof(this.LIST[0]) == "string")
				{
					this.LIST.sort();
				}
			}
			else if(type.toLowerCase() == "descending")
			{
				if(typeof(this.LIST[0]) == "number")
				{
					this.LIST.sort(function(a, b){return b - a});
				}
				else if(typeof(this.LIST[0]) == "string")
				{
					this.LIST.sort();
					this.List.reverse();
				}
			}
		}
	});
	
	//---------------------------------------------------------Audio
	
	function Audio()
	{
		this.type = "audio";
		this.audio = document.createElement("AUDIO");
		this.audio.style.display = "none";
	}
	Object.assign(Audio.prototype, {
		src: function(url) 
		{
			
			  if (this.audio.canPlayType("audio/mpeg")) {
				this.audio.setAttribute("src",url);
			  } else {
				this.audio.setAttribute("src",url);
			  }

			  this.audio.setAttribute("controls", "controls");
		},
		play: function()
		{
			this.audio.play();
		},
		setTime: function(time)
		{
			this.audio.currentTime = time;
		},
		loop: function()
		{
			this.audio.setAttribute("loop", "loop");
		},
		pause: function()
		{
			this.audio.pause();
		},
		stop: function() 
		{
			this.audio.pause();
			this.audio.currentTime = 0;
		},
		volume: function(v)
		{
			this.audio.volume = v;
		}
	});
	
	//------------------------------------------------------areaTriangle
	
	function areaTriangle(s1,s2,s3) 
	{	
		var S1 = Math.abs(s1);
		var S2 = Math.abs(s2);
		var S3 = Math.abs(s3);
		
		var half = (S1+S2+S3)/2;
		return Math.sqrt(half*(half-S1)*(half-S2)*(half-S3));
	}
	
	//------------------------------------------------------belongTo
	
	function belongTo(ob, pt)
	{
		var belong;
		var Surface = Math.round(ob.width * ob.height);
		
		//The four sides of rectangle el1
		var a = {x: ob.x, y: ob.y};
		var b = {x: (ob.x + ob.width), y: ob.y};
		var c = {x: ob.x, y:(ob.y+ob.height)};
		var d = {x: (ob.x+ob.width), y: (ob.y+ob.height)};
		
		var point = {x: pt.x(), y: pt.y()};
		
		var face1 = Distance(a, point);
		var face2 = Distance(c, point);
		var face3 = Distance(b, point);
		var face4 = Distance(d, point);
			
		var face5 = ob.height;
		var face6 = ob.width;
			
		var A1 = areaTriangle(face1, face2, face5);
		var A2 = areaTriangle(face1, face3, face6);
		var A3 = areaTriangle(face2, face4, face6);
		var A4 = areaTriangle(face3, face4, face5);
			
		var Sum = Math.round(A1 + A2 + A3 + A4);
			
		if(Sum == Surface)
		{		
			belong = true;
		}
		else
		{
			belong = false;	
		}
		
		return belong;
	}
	
	//--------------------------------------------------------Camera
	
	function Camera(xView, yView, width, height)
	{
		if((xView == null) || (yView == null) || (!width == null) || (height == null))
		{
			console.log("Camera not created.");
			return null;
		}
		else
		{
			this.type = "camera";
			this.xView = xView;
			this.yView = yView;
			this.width = width;
			this.height = height;
			this.zoomIndex = 1;
			this.angle = 0; //in radian
			this.tileMap = [];
			this.mapDecoder = []; //Explanation about the meaning of each of the arrayMap's elements
			this.column = 0;
			this.row = 0;
			this.isTileAtlas = false;
			this.tileSize = 0;
		}
	}
	
	Object.assign(Camera.prototype, {
		
		moveTo: function(x,y)
		{
			this.xView = -x;
			this.yView = -y;
		},
		
		moveX: function(x)
		{
			this.xView += (-x);
		},
		
		moveY: function(y)
		{
			this.yView += (-y);
		},
		
		zoom: function(index)
		{
			this.zoomIndex = Math.abs(index);
		},
		
		rotate: function(degree)
		{
			this.angle = degree * (Math.PI / 180);
		},
		
		setTileMap: function(map, column, row)
		{
			this.tileMap = map;
			this.column = column || 1;
			this.row = row || 1;
		},
		
		setDecoder: function(decoderArray)
		{
			//decoderArray is a two-dimentional array where the 1st element is the code in the tileMap and the 2nd is the tile(rigidbody object)
			this.mapDecoder = decoderArray;
		},
		
		setTileAtlasEnabled: function(bool)
		{
			if(bool == true || bool == false)
			{
				this.isTileAtlas = bool;
			}
			else
			{
				console.log("The argument for 'setTileSizeEnabled' isn't a boolean.");
			}
		},
		
		setTileSize: function(size)
		{
			if(typeof(size) == "number")
			{
				this.tileSize = Number(size);
			}
			else
			{
				console.log("The argument of 'setTileSize' isn't a number.");
			}
		},
		
		getTile: function(col, ro)
		{
			return this.tileMap[ro * this.column + col];
		}
	});
	
	//---------------------------------------------closeFullScreen
	
	function closeFullscreen() 
	{
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	}
	
	//---------------------------------------------createButton
	
	function createButton(x, y,width, height)
	{
		this.type = "button";
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.style = "black";
		this.text = "Button";
		this.font = "20px Georgia";
		this.textColor = "white";
	}
	
	Object.assign(createButton.prototype, {
		setText: function(text)
		{
			this.text = text;
		},
		setColor: function(st)
		{
			this.style = st;
		},
		setTextColor: function(col)
		{
			this.textColor = col;
		},
		setFont: function(ft)
		{
			this.font = ft;
		},
		linkTo: function(object) {
			
			return belongTo(this, object);
		}
	});
	
	//---------------------------------------------createText
	
	function createText(text, x, y)
	{
		this.type = "text";
		this.text = [];
		this.text[0] = text || "text";
		this.text[1] = x || 0;
		this.text[2] = y || 0;
		this.text[3] = "16px Arial";
		this.text[4] = "black";
		this.text[5] = "left";
	}
	Object.assign(createText.prototype, {
		
		setFont: function(font)
		{
			//font="italic small-caps bold 12px arial"
			//font = "font-style font-variant font-weight font-size font-family"
			this.text[3] = font;
		},
		color: function(color)
		{
			this.text[4] = color;
		},
		textAlign: function(align)
		{		
			this.text[5] = align;
		}
	});
	
	//-------------------------------------------------------Distance
	
	function Distance(point1, point2) 
	{		
		return Math.sqrt((Math.pow((point2.x - point1.x),2)+Math.pow((point2.y - point1.y),2)));
	}
	
	//--------------------------------------------------------isInside
	
	function isInside(el1,el2) {
		
		var isIN;
		var Area = el1.width * el1.height;
		
		//The four sides of rectangle el1
		var A = {x: el1.x, y: el1.y};
		var B = {x: (el1.x + el1.width), y: el1.y};
		var C = {x: el1.x, y:(el1.y+el1.height)};
		var D = {x: (el1.x+el1.width), y: (el1.y+el1.height)};
		
		var points = []; //all points on el2
			//Top line
		for(var a = el2.x; a < (el2.width + el2.x); a++)
		{
			points.push({x:a, y:el2.y});
		}
			//Left line
		for(var b = el2.y+1; b < (el2.height + el2.y); b++)
		{
			points.push({x:el2.x, y:b});
		}
			//Right line
		for(var c = el2.y; c < (el2.height + el2.y); c++)
		{
			points.push({x:(el2.width + el2.x), y:c});
			
		}
			//Bottom line
		for(var d = el2.x; d <= (el2.width + el2.x); d++)
		{
			points.push({x:d, y:(el2.height + el2.y)});
		}
		
		//Check if the points are inside
		for(var ch = 0; ch < points.length; ch++)
		{
			
			var seg1 = Distance(A, points[ch]);
			var seg2 = Distance(C, points[ch]);
			var seg3 = Distance(B, points[ch]);
			var seg4 = Distance(D, points[ch]);
			
			var seg5 = el1.height;
			var seg6 = el1.width;
			
			var Area1 = areaTriangle(seg1, seg2, seg5);
			var Area2 = areaTriangle(seg1, seg3, seg6);
			var Area3 = areaTriangle(seg2, seg4, seg6);
			var Area4 = areaTriangle(seg3, seg4, seg5);
			
			var areaSum = Area1 + Area2 + Area3 + Area4;
			
			if(areaSum == Area)
			{
				
				isIN = true;
				break;
			}
			else
			{
				isIN = false;	
			}
			
		}
		points.splice(0,points.length);
		
		return isIN;
	}
	
	//---------------------------------------------------------------------isItemIn2DArray
	
	function isItemIn2DArray(array, item, indexToSearch)
	{
		//this.index = null;
		for(let i = 0; i< array.length; i++)
		{
			if(array[i][indexToSearch] == item)
			{
				return i;
			}
		}
		return false;
	}
	
	//--------------------------------------------------------------------Key
	
	function Key()
	{
		this.type = "key";
	}
	Object.assign( Key.prototype, {
		A: 65,
		B: 66,
		C: 67,
		D: 68,
		E: 69,
		F: 70,
		G: 71,
		H: 72,
		I: 73,
		J: 74,
		K: 75,
		L: 76,
		M: 77,
		N: 78,
		O: 79,
		P: 80,
		Q: 81,
		R: 82,
		S: 83,
		T: 84,
		U: 85,
		V: 86,
		W: 87,
		X: 88,
		Y: 89,
		Z: 90,
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40,
		SPACE: 32,
		ENTER: 13,
		SHIFT: 16,
		CTRL: 17,
	
		eventListener: function(touche, type, method){
		
			if(type == true)
			{
				document.addEventListener("keydown", function(event){
					if(event.keyCode == touche)
					{
						method();
					}
				});
			}
			else if(type == false)
			{
				document.addEventListener("keyup", function(event){
					if(event.keyCode == touche)
					{
						method();
					}
				});
			}
		}
	});
	
	//-----------------------------------------------------------Mouse
	
	function Mouse(scene)
	{
		this.type = "mouse";
		if(scene)
		{
			this.scene = scene.element;
		}
		else{ this.scene = document.body; }
	}
	Object.assign( Mouse.prototype, {
		eventListener: function(type, method)
		{
			
			if(type == "down")
			{
				this.scene.addEventListener("mousedown", function(event){ var myX = Number(event.offsetX), myY =  Number(event.offsetY); sessionStorage.setItem("pointX", myX); sessionStorage.setItem("pointY", myY); if(method!=null && typeof(method) == "function"){method();}},false);			
			}
			else if(type == "move")
			{
				this.scene.addEventListener("mousemove", function(event){ var myX = Number(event.offsetX), myY = Number(event.offsetY); sessionStorage.setItem("pointX", myX); sessionStorage.setItem("pointY", myY); if(method!=null && typeof(method) == "function"){method();}}, false);				
			}
			else if(type == "up")
			{
				this.scene.addEventListener("mouseup", function(event){ var myX = Number(event.offsetX), myY = Number(event.offsetY); sessionStorage.setItem("pointX", myX); sessionStorage.setItem("pointY", myY); if(method!=null && typeof(method) == "function"){method();}},false);	
			}
			
		},
		
		x: function()
		{
			return Number(sessionStorage.getItem("pointX"));			
		},
		
		y: function()
		{
			return Number(sessionStorage.getItem("pointY"));
		}
	});
	
	//----------------------------------------------------------openFullScreen
	
	function openFullscreen(elem) 
	{
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) { 
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		}
	}
	
	//---------------------------------------------------------------Panel
	
	function Panel(number, element)
	{
		this.type = "panel";
		this.length = parseInt(number);
		this.element = element;
		this.current = 0;
		this.box = [];
		
		for(let i=0; i<this.length; i++)
		{
			this.box[i] = document.createElement("DIV");
			this.box[i].style.width = window.innerWidth+"px";
			this.box[i].style.height = window.innerHeight+"px";
			this.box[i].style.position = "absolute";
			
			if(i != this.current)
			{
				this.box[i].style.display = "none";
			}
			var bow = this.box[i];
			
			window.onresize = ()=>{
				bow.style.width = window.innerWidth+"px";
				bow.style.height = window.innerHeight+"px";
			};
			
			this.element.appendChild(this.box[i]);
		}
	}
	
	Object.assign(Panel.prototype, {
		
		next: function()
		{
			if(this.current < (this.length-1))
			{
				this.current += 1;
				for(let j = 0; j< this.length; j++)
				{
					if(j == this.current)
					{
						this.box[j].style.display = "block";
					}
					else
					{
						this.box[j].style.display = "none";
					}
				}
			}
		},
		
		previous: function()
		{
			if(this.current > 0)
			{
				this.current -= 1;
				
				for(let j = 0; j< this.length; j++)
				{
					if(j == this.current)
					{
						this.box[j].style.display = "block";
					}
					else
					{
						this.box[j].style.display = "none";
					}
				}
			}
		},
		
		addElementTo: function(index, adding)
		{
			this.box[index].appendChild(adding);
		},
		
		addBackgroundTo: function(t,url)
		{
			this.box[t].style.backgroundImage = "url('"+url+"')";
			this.box[t].style.backgroundRepeat = "no-repeat";
			this.box[t].style.backgroundSize = "100% 100%";
		},
		
		addHtmlTo: function(i, text)
		{
			this.box[i].innerHTML = text;
		},
		
		display: function(i)
		{
			this.current = i;
			for(let j = 0; j< this.length; j++)
			{
				if(j == i)
				{
					this.box[j].style.display = "block";
				}
				else
				{
					this.box[j].style.display = "none";
				}
			}
		},
		
		isDisplayed: function(u)
		{
			if(this.box[u].style.display == "none")
			{
				return false;
			}
			else
			{
				return true;
			}
		},
		
		getCurrent: function()
		{
			return this.current;
		},
		
		size: function(x, y)
		{
			for(let h=0; h<this.length; h++)
			{
				this.box[h].style.width = x+"px";
				this.box[h].style.height = y+"px";
			}
		},
		
		getElement: function(q)
		{
			return this.box[q];
		}
	});
	
	//------------------------------------------------------------------rectangleObject
	
	function rectangleObject(left, top, width, height) 
	{
		this.x = left || 0;
		this.y = top || 0;
		this.width = width || 0;
		this.height = height || 0;
		this.right = this.x + this.width;
		this.bottom = this.y + this.height;
	}
	
	Object.assign(rectangleObject.prototype, {
		set: function(left, top, /*optional*/ width, /*optional*/ height) {
			this.x = left;
			this.y = top;
			this.width = width || this.width;
			this.height = height || this.height
			this.right = (this.x + this.width);
			this.bottom = (this.y + this.height);
		},

		within: function(r) {
			return (r.x <= this.x && r.right >= this.right && r.y <= this.y && r.bottom >= this.bottom);
		  },

		overlaps: function(r) {
			return (this.x < r.right && r.x < this.right && this.y < r.bottom && r.y < this.bottom);
		  }
	});
	
	//-----------------------------------------------------------------------Renderer
	
	function Renderer(scene)
	{
		this.type = "renderer";
		this.deltaTime = 0.02;
		this.scene = scene;
		this.ctx = scene.ctx;
		this.dpi = window.devicePixelRatio;
		this.loop = null;
	}
	Object.assign(Renderer.prototype, {
		
		start:function(method)
		{
			this.ctx.clearRect(0,0, scene.width, scene.height);
			
			this.scene.element.setAttribute('width', this.scene.element.width * this.dpi);
			this.scene.element.setAttribute('height', this.scene.element.height * this.dpi);
			
			this.ctx.save();
			this.ctx.imageSmoothingEnabled = false;
			
			if(this.scene.camera != null)
			{
				this.ctx.scale(this.scene.camera.zoomIndex, this.scene.camera.zoomIndex);
				this.ctx.translate(this.scene.camera.xView, this.scene.camera.yView);
				this.ctx.rotate(this.scene.camera.angle);
				
				if((this.scene.camera.isTileAtlas == false) && (this.scene.camera.tileMap.length > 0))
				{
					for(let c = 0; c < this.scene.camera.column; c++)
					{
						for(let r = 0; r < this.scene.camera.row; r++)
						{
							/*for(f in this.scene.camera.mapDecoder)
							{
							
							}*/
							if(this.scene.camera.getTile(c,r) == 1)
							{
								let ind = isItemIn2DArray(this.scene.camera.mapDecoder, 1, 0)
								this.ctx.drawImage(this.scene.camera.mapDecoder[1][ind].material, c * this.scene.camera.mapDecoder[1][ind].width, r * this.scene.camera.mapDecoder[1][ind].height, this.scene.camera.mapDecoder[1][ind].width, this.scene.camera.mapDecoder[1][ind].height);
							}
						}
					}
				}
			}
			
			this.ctx.globalCompositeOperation = "source-over";
			
			//------------------------------------------------------------------------------------------------
			if(scene.element.tagName == "CANVAS"  && scene.type == "scene")
			{
				//FOR RIGIDBODIES----------------
				for(var V = 0; V < this.scene.rigidBodies.length; V++)
				{
					if(this.scene.gravityEnabled == true && this.scene.rigidBodies[V].mass != 0)
					{
						this.scene.rigidBodies[V].y += (this.scene.Gravity*Math.pow(this.deltaTime,2)* this.scene.rigidBodies[V].mass);
					}
					
					this.ctx.drawImage(this.scene.rigidBodies[V].material, this.scene.rigidBodies[V].x, this.scene.rigidBodies[V].y, this.scene.rigidBodies[V].width, this.scene.rigidBodies[V].height);
		
				}
			
				//FOR NODES-------------
				for(var N = 0; N < this.scene.Nodes.length; N++)
				{
					if(this.scene.Nodes[N].type == "text")
					{
						this.ctx.font = this.scene.Nodes[N].text[3];
						this.ctx.fillStyle = this.scene.Nodes[N].text[4];
						this.ctx.textAlign = this.scene.Nodes[N].text[5];
						this.ctx.fillText(this.scene.Nodes[N].text[0], this.scene.Nodes[N].text[1], this.scene.Nodes[N].text[2]);
					}
					
					else if(this.scene.Nodes[N].type == "video")
					{
						this.drawImage(this.scene.Nodes[N].video, this.scene.Nodes[N].x, this.scene.Nodes[N].y, this.scene.Nodes[N].width, this.scene.Nodes[N].height);
					}
					
					else if(this.scene.Nodes[N].type == "audio")
					{
						var liste = document.body.children;
						
						//Delete all the audio already inside the body element
						for (var it = 0; it < liste.length; it++)
						{
							if(liste[it].tagName == "AUDIO")
							{
								document.body.removeChild(liste[it]);
							}
						}
						//Add the new ones
						document.body.appendChild(this.scene.Nodes[N].audio);
					}
					
					else if(this.scene.Nodes[N].type == "button")
					{
					
						this.ctx.lineWidth = 4;
						this.ctx.strokeStyle = "#FFFFFF";
						this.ctx.fillStyle = this.scene.Nodes[N].style;
						
						this.ctx.beginPath();
						this.ctx.moveTo(this.scene.Nodes[N].x + 5, this.scene.Nodes[N].y);
						this.ctx.lineTo(this.scene.Nodes[N].x + this.scene.Nodes[N].width - 5, this.scene.Nodes[N].y);
						this.ctx.quadraticCurveTo(this.scene.Nodes[N].x + this.scene.Nodes[N].width, this.scene.Nodes[N].y, this.scene.Nodes[N].x + this.scene.Nodes[N].width, this.scene.Nodes[N].y + 5);
						this.ctx.lineTo(scene.Nodes[N].x + this.scene.Nodes[N].width, this.scene.Nodes[N].y + this.scene.Nodes[N].height - 5);
						this.ctx.quadraticCurveTo(this.scene.Nodes[N].x + this.scene.Nodes[N].width, this.scene.Nodes[N].y + this.scene.Nodes[N].height, this.scene.Nodes[N].x + this.scene.Nodes[N].width - 5, this.scene.Nodes[N].y + this.scene.Nodes[N].height);
						this.ctx.lineTo(this.scene.Nodes[N].x + 5, this.scene.Nodes[N].y + this.scene.Nodes[N].height);
						this.ctx.quadraticCurveTo(this.scene.Nodes[N].x, this.scene.Nodes[N].y + this.scene.Nodes[N].height, this.scene.Nodes[N].x, this.scene.Nodes[N].y + this.scene.Nodes[N].height - 5);
						this.ctx.lineTo(this.scene.Nodes[N].x, this.scene.Nodes[N].y + 5);
						this.ctx.quadraticCurveTo(this.scene.Nodes[N].x, this.scene.Nodes[N].y, this.scene.Nodes[N].x + 5, this.scene.Nodes[N].y);
						this.ctx.closePath();
						this.ctx.stroke();
						this.ctx.fill();
						  
						this.ctx.font= this.scene.Nodes[N].font;
						this.ctx.textAlign="center"; 
						this.ctx.textBaseline = "middle";
						this.ctx.fillStyle = this.scene.Nodes[N].textColor;
						this.ctx.fillText(this.scene.Nodes[N].text,this.scene.Nodes[N].x+(this.scene.Nodes[N].width/2),this.scene.Nodes[N].y+(this.scene.Nodes[N].height/2));
					}
				}
			}
			else
			{
				console.log("Error. \n The argument of the Renderer function is not a scene.");
			}
			//------------------------------------------------------------------------------------------------
			
			if(method)
			{
				method();
			}
			
			this.ctx.restore();
			
			this.loop = requestAnimationFrame(()=>this.start(method));
		},
		
		stop:function()
		{
			cancelAnimationFrame(this.loop);
		},
		
		changeScene: function(newScene, meth)
		{
			this.scene.element.style.display = "none";
			this.stop();
			this.constructor(newScene);
			this.start(meth);
			console.log("Scene changed");
		}
	});
	
	//---------------------------------------------------rigidBody
	
	function rigidBody(x,y,width,height)
	{
		this.type = "rigidBody";
		
		this.material = new Image();
		this.x = Math.abs(x) || 0;
		this.y = Math.abs(y) || 0;
		this.width = Math.abs(width) || 1;
		this.height = Math.abs(height) || 1;
		
		this.massEnabled = false;
		this.timer = 0;
		this.mass = 50;
	}
	
	Object.assign(rigidBody.prototype, {
		
		setTexture: function(url)
		{
			this.material.src = url;
		},
		
		setWidth: function(wi)
		{
			this.width = Math.abs(wi);
		},
		
		setHeight: function(hei)
		{
			this.height = Math.abs(hei);
		},
		
		setX: function(x)
		{
			this.x = x;
		},
		
		setY: function(y)
		{
			this.y = y;
		},
		
		setWeight:function(mass)
		{
			this.mass = Math.abs(mass);
		},
		
		getX: function()
		{
			return this.x;
		},
		
		getY: function()
		{
			return this.y;
		},
		
		getWidth: function()
		{
			return this.width;
		},
		
		getHeight: function()
		{
			return this.height;
		},
		
		getCoordinates: function()
		{
			return {x: this.x, y: this.y};
		}
	});
	
	//-------------------------------------------------------------------Scene
	
	function Scene(width, height, panel)
	{
		this.type = "scene";
		this.width = Math.abs(width) || window.screen.width;
		this.height = Math.abs(height) || window.screen.height;
		
		this.rigidBodies = new Array();
		this.Nodes = new Array();
		
		this.element = document.createElement("CANVAS");
		this.element.width = this.width;
		this.element.height = this.height;
		this.element.style.backgroundColor = "black";
		this.element.style.display = "none"; //HIDE THE SCENE
		this.ctx = this.element.getContext("2d");
		
		this.camera = null;
		this.gravityEnabled = false;
		this.Gravity = 0.0;
		
		this.parent = false;
		this.getPanel = null;
		
		if(!panel)
		{
			document.body.appendChild(this.element);
			document.body.style.backgroundColor = "black";
		}
		else if(panel!= null && panel.type == "panel")
		{
			panel.element.appendChild(this.element);
			panel.element.style.backgroundColor = "black";
			this.parent = true;
			this.getPanel = panel;
		}
	}
	
	Object.assign(Scene.prototype, {
		
		setBackgroundColor: function(color)
		{
			this.element.style.backgroundColor = color;
			
			if(this.parent == false)
			{
				document.body.style.backgroundColor = "white";
			}
			else
			{
				this.getPanel.element.style.backgroundColor = "white";
			}
		},
		
		setStaticBackground: function(url)
		{
			this.element.style.backgroundImage = "url('"+url+"')";
			this.element.style.backgroundRepeat = "no-repeat";
			this.element.style.backgroundSize = "100% 100%";
			
			if(this.parent == false)
			{
				document.body.style.backgroundColor = "white";
			}
			else
			{
				this.getPanel.element.style.backgroundColor = "white";
			}
		},
		
		setGravityEnabled: function(bool)
		{
			if(bool == true || bool == false)
			{
				this.gravity = bool;
			}
		},
		
		setGravityMagnitude:function(magnitude)
		{
			this.Gravity = Number(magnitude);
		},
		
		add: function(material)
		{
			if(material.type == "rigidBody")
			{
				this.rigidBodies.push(material);
				
				material.bodyScene = this;
			}
			else if(material.type == "video" || material.type == "audio" || material.type == "text" || material.type == "button")
			{
				this.Nodes.push(material);
			}
			else if(material.type == "camera")
			{
				this.camera = material;
				this.element.style.display = "block";
			}
		},
		
		remove: function(material)
		{
			if(material.type == "rigidBody")
			{
				this.rigidBodies.splice(this.rigidBodies.indexOf(material), 1);
			}
			else if(material.type == "video" || material.type == "audio" || material.type == "text" || material.type == "button")
			{
				this.Nodes.splice(this.Nodes.indexOf(material), 1);
			}
		}
	});
	
	//-------------------------------------------------------ScreenDimension
	
	function ScreenDimension()
	{
		this.type = "dimension";
	}
	
	Object.assign(ScreenDimension.prototype, {
		
		height : window.screen.height,
		width : window.screen.width,
		webTabHeight : window.innerWidth,
		webTabWidth : window.innerHeight
	});
	
	//-------------------------------------------------------------Vector
	
	function Vector(x, y)
	{
		this.type = "vector";
		this.x = x;
		this.y = y;
	}
	Object.assign(Vector.prototype, {
		
		add: function(vect)
		{
			return (new Vector(vect.x+this.x, vect.y+this.y));
		},
		sub: function(vect)
		{
			return (new Vector(vect.x - this.x, vect.y - this.y));
		},
		product: function(vect)
		{
			if(vect.type)
			{
				if(vect.type=="vector"){return (new Vector(vect.x * this.x, vect.y * this.y));}
			}
			else
			{
				return (new Vector(vect * this.x, vect * this.y));
			}
		},
		magnitude: function()
		{
			return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
		},
		direction: function()
		{
			//Radian
			return Math.atan(this.y/this.x)*(Math.PI/180);
		},
		dotProduct: function(obj)
		{
			if(obj.type)
			{
				if(obj.type=="vector"){return ((obj.x * this.x) + (obj.y * this.y));}
			}
			else
			{
				return ((obj * this.x) + (obj * this.y)) ;
			}
		},
		angleBetween: function(obj)
		{
			return Math.acos(((obj.x * this.x) + (obj.y * this.y))/(Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))*Math.sqrt(Math.pow(obj.x,2)+Math.pow(obj.y,2))))*(Math.PI/180);
		},
		Distance: function(b)
		{
		  return Math.sqrt(Math.pow((this.x - b.x),2) + Math.pow((this.y - b.y), 2));
		},
		crossProduct: function(vector)
		{
			return ((this.x * vector.y)-(this.y * vector.x)); // Magnitude at the z-axis
		}
	});
	
	//-------------------------------------------------Video
	
	function Video(width, height, x, y){
		
		this.type = "video";
		this.video = document.createElement("VIDEO");
		
		this.width = width || window.innerWidth/3;
		this.height = height || window.innerHeight/3;
		this.x = x || 0;
		this.y = y || 0;
		
		//this.video.width = this.width;
		//this.video.height = this.height;
	}
	Object.assign(Video.prototype, {
		
		src: function(url) {
			this.video.setAttribute("src",url);
			this.video.setAttribute("controls", "controls");
		},
		loop: function(){
			this.video.setAttribute("loop", "loop");
		},
		mute: function(){
			this.video.muted = true;
		},
		play: function(){
			this.video.play();
		},
		pause: function(){
			this.video.pause();
		},
		stop: function() {
			this.video.pause();
			this.video.currentTime = 0;
		},
		setTime: function(time)
		{
			this.video.currentTime = time;
		},
		volume: function(v){
			this.video.volume = v;
		}
	});

	
	exports.Audio = Audio;
	exports.areaTriangle = areaTriangle;
	exports.ArrayList = ArrayList;
	exports.belongTo = belongTo; //Check if a point is inside an object
	exports.Camera = Camera;
	exports.closeFullscreen = closeFullscreen;
	exports.createButton = createButton;
	exports.createText = createText;
	exports.Distance = Distance; //Distance between two points
	exports.isInside = isInside; //Check if a rectangle object is inside another one. Good for collision detection
	exports.isItemIn2DArray = isItemIn2DArray;
	exports.Key = Key;
	exports.Mouse = Mouse;
	exports.openFullscreen = openFullscreen;
	exports.Panel = Panel;
	exports.rectangleObject = rectangleObject;
	exports.Renderer = Renderer;
	exports.rigidBody = rigidBody;
	exports.Scene = Scene;
	exports.ScreenDimension = ScreenDimension; //Screen Dimension
	exports.Vector = Vector;
	exports.Video = Video;
	
	Object.defineProperty(exports, '__esModule', { value: true });
})));