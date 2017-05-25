$(document).ready(function(){
	//Available characters
	var characters = [{
        name: "Gatling Pea",
        health: 120,
        attack: 8,
        counterAtk: 17,
        imgURL: "assets/images/machineGun.png"
    },

    {
        name: "Snow Pea",
        health: 100,
        attack: 14,
        counterAtk: 5,
        imgURL: "assets/images/snowPea.png"
    },

    {
        name: "Zombie",
        health: 150,
        attack: 8,
        counterAtk: 23,
        imgURL: "assets/images/zombie.png"

    },

    {
        name: "Football Zombie",
        health: 180,
        attack: 5,
        counterAtk: 25,
        imgURL: "assets/images/football.png"
    }
];

	var complete = false;
	var userDead = false;
	

	function startGame() {
		//Loops through characters in the object array and displays them on character area
		for (var i = 0; i < characters.length; i++) {
			var charDiv = $("<div>").addClass("character");
			var charName = $("<h2>").addClass("charName").text(characters[i].name);
			var charImg = $("<img>").addClass("charImg").attr("src", characters[i].imgURL);
			var charHP = $("<p>").addClass("charHP").text(characters[i].health);
			var charAtk = $("<p>").addClass("charAtk").text(characters[i].attack).hide();
			var charCounter = $("<p>").addClass("charCounter").text(characters[i].counterAtk).hide();
			charDiv.append(charName, charImg, charHP, charAtk, charCounter).appendTo(".characterGroup")
			//console.log(selectNewEnemy);
			var deadCount = 0;
		}

		var check1 = false;

		function click() {
			$(".characterGroup").children().on("click", selectNewEnemy);
		}
		//Select player
		$(".character").on("click", function() {
			if(check1 == false) {
				$(this).addClass("hero").appendTo(".player");
				check1 = true;
			}
			if(check1)
			click();
		})
			

		//Character selected will go to defender area and the rest will hide
		function selectNewEnemy() {
			$(this).addClass("selected").appendTo('.defender');
			$(this).addClass("enemy").appendTo(".defender");
			$(".characterGroup").children().on("click").hide();
			$(".atk").on("click", attack);
			console.log(this);
		}

		var attackCount = 0;

		function attack() {
			
			//var player = $(".hero").find(".charName").text();
        	//console.log(player);
        	//var enemy = $(".defender").find(".charName").text();

        	var playerAtk = $(".hero").find(".charAtk").text();
			var playerHp = $(".hero").find(".charHP").text();	        	
        	//console.log("Health:" + playerHp);
        	var enemyAtk = $(".defender").find(".charCounter").text();
        	var enemyHp = $(".defender").find(".charHP").text();

        	//var playerMessage = player + " attacked for " + playerAtk;
        	//var enemyMessage = enemy + " attacked for " + enemyAtk;

        	//When the player attacks and attack bonus
			attackCount = attackCount +1;
        	enemyHp = enemyHp - playerAtk * attackCount;
        	$(".defender").find(".charHP").text(enemyHp);
        	//console.log(enemy + ": " + enemyHp);

        	//Condition when enemy dies
        	if (enemyHp <= 0) {
        		$(".selected").remove();
        		deadCount = deadCount + 1;
        		$(".statements").html("pick a new opponent");
        		$(".characterGroup").children().show();
        		click();
        	//If enemy is not dead, enemy attacks player
        	} else {
            	playerHp = playerHp - enemyAtk;   	
        	}
        	//Updates player health
        	$(".hero").find(".charHP").text(playerHp);
        	//console.log("Health:" + playerHp);

        	//Condition lose game if player runs out of health
        	if (playerHp <= 0) {
        		$(".hero").html("You are dead").append("<img class='charImg' src='assets/images/grave.png' />");
        		userDead = true;
        	}
        	
        	
        	console.log(deadCount);
        	if (deadCount >= 3 || userDead) {
        		complete = true;
        		$(".statements").html("You win!");
        	}
        	/*if (complete) {
        		$(".reset").on("click", reset), startGame;
        	}*/

		}
	}

	/*function reset() {
		var player = "";
    	var enemy = "";
    	var playerAtk = "";
		var playerHp =  "";
    	var enemyAtk = "";
    	var enemyHp = "";
    	var complete = false;
		var userDead = false;
		var charDiv = "";
		var charName = "";
		var charImg = "";
		var charHP = "";
		var charAtk = "";
		var charCounter = "";
		var check1 = false;
	}
	*/

	startGame();

});