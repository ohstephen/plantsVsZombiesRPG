$(document).ready(function(){

	var characters = [{
        name: "Gatling Pea",
        health: 120,
        attack: 8,
        enemyattackback: 15,
        imgURL: "assets/images/machineGun.png"
    },

    {
        name: "Snow Pea",
        health: 100,
        attack: 14,
        enemyattackback: 5,
        imgURL: "assets/images/snowPea.png"
    },

    {
        name: "Zombie",
        health: 150,
        attack: 8,
        enemyattackback: 20,
        imgURL: "assets/images/zombie.png"

    },

    {
        name: "Football Zombie",
        health: 180,
        attack: 7,
        enemyattackback: 25,
        imgURL: "assets/images/football.png"
    }
];

	var dead = false,
		complete = false,
		userDead = false,
		allDead = false,
		gameStart = false;
	var enemy,
		fighter,
		currentPlayer;
	

	function startGame() {
		for (var i = 0; i < characters.length; i++) {
			var charDiv = $("<div>").addClass("character");
			var charName = $("<h2>").addClass("charName").text(characters[i].name);
			var charImg = $("<img>").addClass("charImg").attr("src", characters[i].imgURL);
			var charHP = $("<p>").addClass("charHP").text(characters[i].health);
			var charAtk = $("<p>").addClass("charAtk").text(characters[i].attack).hide();
			var charCounter = $("<p>").addClass("charCounter").text(characters[i].counterAtk).hide();
			charDiv.append(charName, charImg, charHP, charAtk, charCounter).appendTo(".characterGroup")
			//console.log();
			var deadCount = 0;
		}
		var check1 = false;
			//Select player
			$(".character").on("click", function() {
				if(check1 == false) {
					$(this).addClass("hero").appendTo(".player");
					check1 = true;
				}
				if(check1)
				$(".characterGroup").children().on("click", selectNewEnemy);
				//console.log(this);

			})
			

			//Select enemy
			function selectNewEnemy() {
				$(this).addClass("selected").appendTo('.defender');
				$(this).addClass("enemy").appendTo(".defender");
				$(".characterGroup").children().on("click").hide();
				$(".btn").on("click", attack);
			}


			var attackCount = 0;
			function attack() {
				
				var player = $(".hero").find(".charName").text();
	        	console.log(player);
	        	var enemy = $(".defender").find(".charName").text();

	        	var playerAtk = $(".hero").find(".charAtk").text();
				var playerHp = $(".hero").find(".charHP").text();	        	
	        	//console.log("Health:" + playerHp);
	        	var enemyAtk = $(".defender").find(".charAtk").text();
	        	var enemyHp = $(".defender").find(".charHP").text();

	        	var playerMessage = player + " attacked for " + playerAtk;
	        	var enemyMessage = enemy + " attacked for " + enemyAtk;

            	playerHp = playerHp - enemyAtk;
            	console.log("Health:" + playerHp);
            	$(".hero").find(".charHP").text(playerHp);

            	attackCount = attackCount +1;
            	enemyHp = enemyHp - playerAtk * attackCount;
            	console.log("Enemy: " + enemyHp);
            	$(".defender").find(".charHP").text(enemyHp);

            	if (playerHp <= 0) {
            		$(".hero").html("You are dead").append("<img class='charImg' src='assets/images/grave.png' />");
            	}
            	
            	if (enemyHp <= 0) {
            		$(".selected").remove();
            		$(".statements").html("pick a new opponent");
            		$(".characterGroup").children().show().on("click", selectNewEnemy);
            		deadCount = deadCount + 1;
            	}
            	console.log(deadCount);

			}
	}

	startGame();

});