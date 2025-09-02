$(document).ready(function(){
	//Available characters with balanced stats and unique abilities
	var characters = [{
        name: "Gatling Pea",
        health: 100,
        maxHealth: 100,
        attack: 15,
        defense: 5,
        speed: 80,
        imgURL: "assets/images/machineGun.png",
        description: "Fast attacker with multiple shots",
        abilities: {
            basic: { name: "Rapid Fire", damage: 15, cost: 0, description: "Basic attack with chance for double hit" },
            special: { name: "Bullet Barrage", damage: 8, hits: 4, cost: 20, description: "4 rapid shots that bypass defense" }
        },
        energy: 100,
        maxEnergy: 100,
        statusEffects: []
    },

    {
        name: "Snow Pea",
        health: 90,
        maxHealth: 90,
        attack: 12,
        defense: 8,
        speed: 70,
        imgURL: "assets/images/snowPea.png",
        description: "Ice mage with crowd control",
        abilities: {
            basic: { name: "Ice Shot", damage: 12, cost: 0, description: "Basic attack that may freeze enemy" },
            special: { name: "Blizzard", damage: 18, cost: 25, description: "Heavy ice damage that freezes enemy for 2 turns" }
        },
        energy: 100,
        maxEnergy: 100,
        statusEffects: []
    },

    {
        name: "Zombie",
        health: 130,
        maxHealth: 130,
        attack: 18,
        defense: 12,
        speed: 50,
        imgURL: "assets/images/zombie.png",
        description: "Tanky undead with life steal",
        abilities: {
            basic: { name: "Bite", damage: 18, cost: 0, description: "Basic attack that heals for 25% damage dealt" },
            special: { name: "Undead Rage", damage: 25, cost: 30, description: "Powerful attack that increases with missing health" }
        },
        energy: 100,
        maxEnergy: 100,
        statusEffects: []
    },

    {
        name: "Football Zombie",
        health: 120,
        maxHealth: 120,
        attack: 20,
        defense: 15,
        speed: 60,
        imgURL: "assets/images/football.png",
        description: "Armored bruiser with charging attacks",
        abilities: {
            basic: { name: "Tackle", damage: 20, cost: 0, description: "Basic attack that may stun enemy" },
            special: { name: "Charge Rush", damage: 30, cost: 35, description: "Devastating charge that ignores armor" }
        },
        energy: 100,
        maxEnergy: 100,
        statusEffects: []
    }
];

	// Game state variables
	var gameState = {
		phase: "character_selection", // "character_selection", "battle", "victory", "defeat"
		playerCharacter: null,
		enemies: [],
		currentEnemy: null,
		defeatedCount: 0,
		isPlayerTurn: true,
		battleLog: []
	};

	// Status effect definitions
	var statusEffects = {
		frozen: { name: "Frozen", description: "Cannot act", duration: 2, skipTurn: true },
		stunned: { name: "Stunned", description: "Cannot act", duration: 1, skipTurn: true },
		rage: { name: "Rage", description: "+50% damage", duration: 3, damageMod: 1.5 }
	};

	function startGame() {
		displayCharacterSelection();
	}

	function displayCharacterSelection() {
		$(".characterGroup").empty().append("<h2><strong>Choose Your Character</strong></h2>");
		
		for (var i = 0; i < characters.length; i++) {
			var character = characters[i];
			var charDiv = $("<div>").addClass("character selectable").attr("data-index", i);
			var charName = $("<h3>").addClass("charName").text(character.name);
			var charImg = $("<img>").addClass("charImg").attr("src", character.imgURL);
			var charDesc = $("<p>").addClass("charDesc").text(character.description);
			var charStats = $("<div>").addClass("charStats")
				.html(`HP: ${character.health} | ATK: ${character.attack} | DEF: ${character.defense} | SPD: ${character.speed}`);
			
			charDiv.append(charName, charImg, charDesc, charStats).appendTo(".characterGroup");
		}

		$(".character.selectable").on("click", function() {
			var index = parseInt($(this).attr("data-index"));
			selectPlayerCharacter(index);
		});
	}

	function selectPlayerCharacter(index) {
		gameState.playerCharacter = Object.assign({}, characters[index]);
		gameState.enemies = characters.filter((char, i) => i !== index).map(char => Object.assign({}, char));
		
		$(".characterGroup").hide();
		$(".player").empty().append("<h2><strong>Your Character</strong></h2>");
		displayCharacter(gameState.playerCharacter, ".player");
		
		gameState.phase = "battle";
		selectNextEnemy();
	}

	function selectNextEnemy() {
		if (gameState.enemies.length === 0) {
			victory();
			return;
		}

		// AI picks next enemy (for now, just pick the first available)
		gameState.currentEnemy = gameState.enemies.shift();
		
		$(".defender").empty().append("<h2><strong>Enemy</strong></h2>");
		displayCharacter(gameState.currentEnemy, ".defender");
		
		setupBattleUI();
	}

	function displayCharacter(character, container) {
		var charDiv = $("<div>").addClass("character-display");
		var charName = $("<h3>").text(character.name);
		var charImg = $("<img>").addClass("charImg").attr("src", character.imgURL);
		var charStats = $("<div>").addClass("stats-display")
			.html(`
				<div class="health-bar">
					<div class="health-fill" style="width: ${(character.health/character.maxHealth)*100}%"></div>
					<span class="health-text">${character.health}/${character.maxHealth} HP</span>
				</div>
				<div class="energy-bar">
					<div class="energy-fill" style="width: ${(character.energy/character.maxEnergy)*100}%"></div>
					<span class="energy-text">${character.energy}/${character.maxEnergy} Energy</span>
				</div>
			`);
		
		var statusDiv = $("<div>").addClass("status-effects");
		updateStatusEffects(character, statusDiv);
		
		charDiv.append(charName, charImg, charStats, statusDiv);
		$(container).append(charDiv);
	}

	function updateCharacterDisplay(character, container) {
		var $container = $(container);
		var $display = $container.find('.character-display');
		
		if ($display.length === 0) {
			// If display doesn't exist, create it
			displayCharacter(character, container);
			return;
		}

		// Update health bar with animation
		var healthPercent = (character.health / character.maxHealth) * 100;
		var $healthFill = $display.find('.health-fill');
		var $healthText = $display.find('.health-text');
		
		$healthFill.animate({ width: healthPercent + '%' }, 300);
		$healthText.text(`${character.health}/${character.maxHealth} HP`);

		// Update energy bar with animation
		var energyPercent = (character.energy / character.maxEnergy) * 100;
		var $energyFill = $display.find('.energy-fill');
		var $energyText = $display.find('.energy-text');
		
		$energyFill.animate({ width: energyPercent + '%' }, 300);
		$energyText.text(`${character.energy}/${character.maxEnergy} Energy`);

		// Update status effects
		var $statusDiv = $display.find('.status-effects');
		updateStatusEffects(character, $statusDiv);
	}

	function updateStatusEffects(character, $statusDiv) {
		$statusDiv.empty();
		character.statusEffects.forEach(effect => {
			$statusDiv.append(`<span class="status-effect">${effect.name} (${effect.duration})</span>`);
		});
	}

	function setupBattleUI() {
		$("#fight").empty().append(`
			<h2><strong>Battle Phase</strong></h2>
			<div class="action-buttons">
				<button type="button" class="btn btn-primary btn-lg" id="basic-attack">
					${gameState.playerCharacter.abilities.basic.name}
				</button>
				<button type="button" class="btn btn-success btn-lg" id="special-attack">
					${gameState.playerCharacter.abilities.special.name} (${gameState.playerCharacter.abilities.special.cost} Energy)
				</button>
			</div>
			<div class="battle-log">
				<h4>Battle Log:</h4>
				<div id="log-content"></div>
			</div>
		`);

		$("#basic-attack").on("click", function() { executePlayerAction("basic"); });
		$("#special-attack").on("click", function() { executePlayerAction("special"); });
		
		updateUI();
		logMessage(`Battle started against ${gameState.currentEnemy.name}!`);
	}

	function executePlayerAction(actionType) {
		if (!gameState.isPlayerTurn) return;

		var player = gameState.playerCharacter;
		var enemy = gameState.currentEnemy;
		var ability = player.abilities[actionType];

		// Check if player can use the ability
		if (ability.cost > player.energy) {
			logMessage("Not enough energy!");
			return;
		}

		// Check if player is affected by status effects that prevent actions
		if (hasStatusEffect(player, "frozen") || hasStatusEffect(player, "stunned")) {
			logMessage(`${player.name} is unable to act!`);
			endPlayerTurn();
			return;
		}

		// Deduct energy cost
		player.energy -= ability.cost;

		// Execute the ability
		performAbility(player, enemy, ability, actionType);
		
		// Update UI and check if enemy is defeated
		updateUI();
		
		if (enemy.health <= 0) {
			enemyDefeated();
		} else {
			endPlayerTurn();
		}
	}

	function performAbility(attacker, defender, ability, actionType) {
		var damage = ability.damage;
		var attackerName = attacker.name;

		// Apply status effect modifiers
		if (hasStatusEffect(attacker, "rage")) {
			damage = Math.floor(damage * statusEffects.rage.damageMod);
		}

		// Execute special ability logic
		switch (actionType) {
			case "basic":
				if (attackerName === "Gatling Pea") {
					// 30% chance for double hit
					if (Math.random() < 0.3) {
						logMessage(`${attackerName} used ${ability.name} - Double Hit!`);
						dealDamage(defender, damage);
						dealDamage(defender, damage);
						return;
					}
				} else if (attackerName === "Snow Pea") {
					// 25% chance to freeze
					if (Math.random() < 0.25) {
						addStatusEffect(defender, "frozen");
						logMessage(`${attackerName} used ${ability.name} - ${defender.name} is frozen!`);
					}
				} else if (attackerName === "Zombie") {
					// Life steal - heal for 25% of damage dealt
					var healing = Math.floor(damage * 0.25);
					healCharacter(attacker, healing);
					logMessage(`${attackerName} used ${ability.name} and healed for ${healing} HP!`);
				} else if (attackerName === "Football Zombie") {
					// 20% chance to stun
					if (Math.random() < 0.2) {
						addStatusEffect(defender, "stunned");
						logMessage(`${attackerName} used ${ability.name} - ${defender.name} is stunned!`);
					}
				}
				break;

			case "special":
				if (attackerName === "Gatling Pea") {
					// Bullet Barrage - 4 hits that bypass defense
					logMessage(`${attackerName} used ${ability.name}!`);
					for (var i = 0; i < ability.hits; i++) {
						dealDamage(defender, ability.damage, true); // true = bypass defense
					}
					return;
				} else if (attackerName === "Snow Pea") {
					// Blizzard - freeze for 2 turns
					addStatusEffect(defender, "frozen");
					logMessage(`${attackerName} used ${ability.name} - ${defender.name} is frozen solid!`);
				} else if (attackerName === "Zombie") {
					// Undead Rage - more damage based on missing health
					var missingHealthPercent = (attacker.maxHealth - attacker.health) / attacker.maxHealth;
					var bonusDamage = Math.floor(damage * missingHealthPercent);
					damage += bonusDamage;
					addStatusEffect(attacker, "rage");
					logMessage(`${attackerName} used ${ability.name} with ${bonusDamage} bonus damage!`);
				} else if (attackerName === "Football Zombie") {
					// Charge Rush - ignores armor
					logMessage(`${attackerName} used ${ability.name} - ignoring armor!`);
					dealDamage(defender, damage, true); // true = bypass defense
					return;
				}
				break;
		}

		// Standard damage if not handled specially
		logMessage(`${attackerName} used ${ability.name}!`);
		dealDamage(defender, damage);
	}

	function dealDamage(target, damage, bypassDefense = false) {
		var actualDamage = bypassDefense ? damage : Math.max(1, damage - target.defense);
		target.health = Math.max(0, target.health - actualDamage);
		logMessage(`${target.name} takes ${actualDamage} damage!`);
		
		// Visual feedback for taking damage
		triggerDamageFlash(target);
	}

	function healCharacter(character, healAmount) {
		character.health = Math.min(character.maxHealth, character.health + healAmount);
		
		// Visual feedback for healing
		triggerHealFlash(character);
	}

	function triggerDamageFlash(character) {
		var container = character === gameState.playerCharacter ? ".player" : ".defender";
		var $display = $(container).find('.character-display');
		
		$display.addClass('damage-flash');
		setTimeout(function() {
			$display.removeClass('damage-flash');
		}, 300);
	}

	function triggerHealFlash(character) {
		var container = character === gameState.playerCharacter ? ".player" : ".defender";
		var $display = $(container).find('.character-display');
		
		$display.addClass('heal-flash');
		setTimeout(function() {
			$display.removeClass('heal-flash');
		}, 400);
	}

	function endPlayerTurn() {
		gameState.isPlayerTurn = false;
		
		// Process status effects for player
		processStatusEffects(gameState.playerCharacter);
		
		// Enemy turn
		setTimeout(function() {
			enemyTurn();
		}, 1000);
	}

	function enemyTurn() {
		var enemy = gameState.currentEnemy;
		var player = gameState.playerCharacter;

		// Check if enemy can act
		if (hasStatusEffect(enemy, "frozen") || hasStatusEffect(enemy, "stunned")) {
			logMessage(`${enemy.name} is unable to act!`);
			startPlayerTurn();
			return;
		}

		// Simple AI: Use special if enough energy, otherwise basic attack
		var actionType = (enemy.energy >= enemy.abilities.special.cost && Math.random() < 0.4) ? "special" : "basic";
		
		logMessage(`${enemy.name}'s turn...`);
		setTimeout(function() {
			performAbility(enemy, player, enemy.abilities[actionType], actionType);
			enemy.energy -= enemy.abilities[actionType].cost;
			
			updateUI();
			
			if (player.health <= 0) {
				defeat();
			} else {
				startPlayerTurn();
			}
		}, 1500);
	}

	function startPlayerTurn() {
		// Process status effects
		processStatusEffects(gameState.currentEnemy);
		
		// Regenerate some energy
		gameState.playerCharacter.energy = Math.min(gameState.playerCharacter.maxEnergy, 
			gameState.playerCharacter.energy + 15);
		gameState.currentEnemy.energy = Math.min(gameState.currentEnemy.maxEnergy, 
			gameState.currentEnemy.energy + 10);
		
		gameState.isPlayerTurn = true;
		updateUI();
	}

	function processStatusEffects(character) {
		character.statusEffects = character.statusEffects.filter(effect => {
			effect.duration--;
			if (effect.duration <= 0) {
				logMessage(`${character.name} recovers from ${effect.name}`);
				return false;
			}
			return true;
		});
	}

	function hasStatusEffect(character, effectName) {
		return character.statusEffects.some(effect => effect.name === statusEffects[effectName].name);
	}

	function addStatusEffect(character, effectName) {
		var effect = Object.assign({}, statusEffects[effectName]);
		// Remove existing effect of same type
		character.statusEffects = character.statusEffects.filter(e => e.name !== effect.name);
		character.statusEffects.push(effect);
	}

	function updateUI() {
		// Update player display with smooth animations
		updateCharacterDisplay(gameState.playerCharacter, ".player");
		// Update enemy display with smooth animations
		updateCharacterDisplay(gameState.currentEnemy, ".defender");
		
		// Update button states
		var specialBtn = $("#special-attack");
		if (gameState.playerCharacter.energy < gameState.playerCharacter.abilities.special.cost) {
			specialBtn.prop('disabled', true).addClass('btn-secondary').removeClass('btn-success');
		} else {
			specialBtn.prop('disabled', false).removeClass('btn-secondary').addClass('btn-success');
		}

		// Disable buttons if not player turn
		if (!gameState.isPlayerTurn) {
			$(".action-buttons button").prop('disabled', true);
		} else {
			$("#basic-attack").prop('disabled', false);
		}
	}

	function logMessage(message) {
		$("#log-content").append(`<p>${message}</p>`);
		$("#log-content").scrollTop($("#log-content")[0].scrollHeight);
	}

	function enemyDefeated() {
		var audio = new Audio("assets/sounds/chomp.mp3");
		audio.play();
		
		gameState.defeatedCount++;
		logMessage(`${gameState.currentEnemy.name} is defeated!`);
		
		// Heal player slightly between fights
		if (gameState.playerCharacter.health < gameState.playerCharacter.maxHealth) {
			healCharacter(gameState.playerCharacter, 20);
			logMessage(`${gameState.playerCharacter.name} recovers 20 HP between battles!`);
		}
		gameState.playerCharacter.energy = Math.min(gameState.playerCharacter.maxEnergy,
			gameState.playerCharacter.energy + 30);

		setTimeout(function() {
			selectNextEnemy();
		}, 2000);
	}

	function victory() {
		var audio = new Audio("assets/sounds/win.mp3");
		audio.play();
		
		gameState.phase = "victory";
		$("#fight").html(`
			<h2><strong>🎉 VICTORY! 🎉</strong></h2>
			<p>You have defeated all enemies!</p>
			<button type="button" class="btn btn-warning btn-lg" id="play-again">Play Again</button>
		`);
		
		$("#play-again").on("click", function() {
			location.reload();
		});
	}

	function defeat() {
		var audio = new Audio("assets/sounds/loss.mp3");
		audio.play();
		
		gameState.phase = "defeat";
		$(".player").find(".character-display").append("<img class='charImg grave' src='assets/images/grave.png' />");
		
		$("#fight").html(`
			<h2><strong>💀 DEFEAT 💀</strong></h2>
			<p>Your character has fallen in battle...</p>
			<button type="button" class="btn btn-warning btn-lg" id="try-again">Try Again</button>
		`);
		
		$("#try-again").on("click", function() {
			location.reload();
		});
	}

	// Initialize the game
	startGame();

});