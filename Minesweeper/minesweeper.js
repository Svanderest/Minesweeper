var grid;
var sweepCount;
var mines;
var dead;

function makeForm()
{
	let txtLength = document.createElement("input");
	txtLength.type = "text";
	txtLength.id = "txtLength";
	txtLength.placeholder = "Length";
	document.getElementById("controls").appendChild(txtLength)

	let txtWidth = document.createElement("input");
	txtWidth.type = "text";
	txtWidth.id = "txtWidth";
	txtWidth.placeholder = "Width";
	document.getElementById("controls").appendChild(txtWidth);

	let txtMines = document.createElement("input");
	txtMines.type = "text";
	txtMines.id = "txtMines";
	txtMines.placeholder = "Number of Mines";
	document.getElementById("controls").appendChild(txtMines);

	let btnMakeBoard = document.createElement("input");
	btnMakeBoard.type = "button";
	btnMakeBoard.onclick = makeBoard;
	btnMakeBoard.value = "Create Board";
	document.getElementById("controls").appendChild(btnMakeBoard);

}

function makeBoard()
{
	let length = parseInt(document.getElementById("txtLength").value);
	let width = parseInt(document.getElementById("txtWidth").value);
	mines = parseInt(document.getElementById("txtMines").value);
	sweepCount = 0;
	grid = new Array(length);
	dead = false;
	document.getElementById("mines").innerHTML = null;
	if(mines>= length*width)
	{
		alert("Too many mines");
		return;
	}

	for(let i=0; i<length; i++)
	{
		grid[i] = new Array(width);
		let rowDiv = document.createElement("div");
		for(let j=0; j<width; j++)
		{
			grid[i][j] = new Object();
			grid[i][j].button = document.createElement("input");
			grid[i][j].button.type = "button";
			grid[i][j].button.value = "";
			grid[i][j].button.id = i + "," + j;
			grid[i][j].button.onclick = function(evt) 
			{
				this.blur();
				var cords = this.id.split(","); 	
				if(evt.shiftKey)
					flag(parseInt(cords[0]),parseInt(cords[1]));	
				else
					sweep(parseInt(cords[0]),parseInt(cords[1]));
			}
			rowDiv.appendChild(grid[i][j].button);
			grid[i][j].mine = false;
			grid[i][j].swept = false;
			grid[i][j].flagged = false;
			grid[i][j].count = 0;
		}
		document.getElementById("mines").appendChild(rowDiv);
	}

	let count = 0;
	while(count < mines)
	{
		let randX = Math.floor(length*Math.random());
		let randY = Math.floor(width*Math.random());
		if(!grid[randX][randY].mine)
		{
			grid[randX][randY].mine = true;
			adjCheck(randX,randY,function(s,t) {return true;},function(s,t) {grid[s][t].count++})
			count++;
		}
	} 
}

function adjCheck(x,y,condition,fct)
{
	let total = 0;
	for(let i = Math.max(0,x-1); i<=Math.min(x+1,grid.length-1); i++)
	{
		for(let j = Math.max(0,y-1); j<=Math.min(y+1,grid[i].length-1); j++)
		{
			if((x != i || j != y) && condition(i,j))
			{
				fct(i,j)
				total++;
			}
		}
	}
	return total;
}

function sweep(x,y)
{
	if(grid[x][y].flagged || dead)
		return;
	if(grid[x][y].mine)
	{
		grid[x][y].button.value = "\u26ef";
		alert("You loose");
		dead = true;
	}
	else if (grid[x][y].swept)
	{
		let flagCount = adjCheck(x,y,function(s,t){return grid[s][t].flagged},function(s,t){return;})
		if(flagCount == grid[x][y].count)
			adjCheck(x,y,function(s,t){return !grid[s][t].flagged && !grid[s][t].swept},sweep)
	}
	else
	{
		grid[x][y].swept = true;
		grid[x][y].button.className = "c" + grid[x][y].count;
		grid[x][y].button.style = "background-color: #eee;"
		if(grid[x][y].count == 0)
			adjCheck(x,y,function(s,t){return !grid[s][t].swept},sweep)
		else
			grid[x][y].button.value = grid[x][y].count;
		sweepCount++;
		if(sweepCount+mines == grid.length*grid[0].length)
		{
			for(i in grid)
			{
				for (j in grid[i])
				{
					if(!grid[i][j].swept && !grid[i][j].flagged)					
						flag(i,j);					
				}
			}
			alert("You win");
		}
	}
}

function flag(x,y)
{
	if(grid[x][y].swept || dead)
		return;
	if(grid[x][y].flagged)
	{
		grid[x][y].button.value = "";
		grid[x][y].flagged = false
	} 
	else
	{
		grid[x][y].button.value = "\u2691";
		grid[x][y].flagged = true;
	}
}