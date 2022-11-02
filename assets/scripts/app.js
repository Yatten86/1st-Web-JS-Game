//global constant 
const ATTACK_VALUE = 10;   
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';  // MODE_ATTACK = 0;
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; // STRONG_MODE_ATTACK = 1;
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_GAME_OVER = 'GAME_OVER'

//setting maximum HP box
const enteredValue = prompt('Set maximum life for you and monster', '100');

//takes the typed max HP, and insertit to the game...
let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

//check if user enters a number / if not set max life to maximum of 100.
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

//Log function (get all data form the game)
function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
    if (ev === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = 'MONSTER';
    } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
        logEntry = {
            event: ev,
            value: val,
            target: 'MOSNTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
        battleLog.push(logEntry);
    } else if (ev = LOG_EVENT_MONSTER_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
        battleLog.push(logEntry);
    } else if (ev === LOG_EVENT_PLAYER_HEAL) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
        battleLog.push(logEntry);
    } else if (ev === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: ev,
            value: val,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
        battleLog.push(logEntry);
    }
}

//reset funnction
function reset() {  
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

//end round conditions and reset bars at the end of the round
function endRound () {
    const initialPlayerHealth = currentMonsterHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK, 
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );

    //initiate use of extra life, if player lose
    if (currentPlayerHealth <= 0 &&  hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        alert('You would be dead but the bous life saved your ass!')
        setPlayerHealth(initialPlayerHealth);
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0){ //send info to the log if PLAYER WON
        alert ('You won!');
        writeToLog(
            LOG_EVENT_GAME_OVER, 
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
        } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) { //send info to the log if MONSTER WON
        alert ('You lost');
        writeToLog(
            LOG_EVENT_GAME_OVER, 
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if ( currentPlayerHealth <= 0 && currentMonsterHealth <= 0){ //send info to the log if DRAW GAME
        alert ('Draw game') 
        writeToLog(
            LOG_EVENT_GAME_OVER, 
            'A DRAW',
            currentMonsterHealth,
            currentPlayerHealth
        );

    }

    if(currentMonsterHealth <= 0 || currentPlayerHealth <= 0) { //reset the game 
        reset();
    }
}


//identify "mode" of attack - normal attack || strong attack
function attackMonster(mode) {
    let maxDamage = 
    mode === MODE_ATTACK 
        ? ATTACK_VALUE 
        : STRONG_ATTACK_VALUE;
    let logEvent = 
        mode === MODE_ATTACK
        ? LOG_EVENT_PLAYER_ATTACK
        : LOG_EVENT_PLAYER_STRONG_ATTACK;
    // if (mode === MODE_ATTACK) {
        // maxDamage = ATTACK_VALUE;
        // logEvent = LOG_EVENT_PLAYER_ATTACK;
    // } else {
        // maxDamage = STRONG_ATTACK_VALUE;
        // logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }
    let damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(
        logEvent, 
        damage,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

//Attack button - function
function attackHandler () {
    attackMonster(MODE_ATTACK);
}

//strong attack button - function
function strongAttackHandler () {
    attackMonster(MODE_STRONG_ATTACK);
}

//heal button - function
function healPlayerHandler () {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert ('You can\'t heal more than your max initial health');
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currentPlayerHealth += HEAL_VALUE;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL, 
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

//print the battle log in the console
function printLogHandler() {
    console.log(battleLog);
}

//attack button
attackBtn.addEventListener('click', attackHandler);

//strong attack button
strongAttackBtn.addEventListener('click', strongAttackHandler);

//heal button
healBtn.addEventListener('click', healPlayerHandler);

//Game log
logBtn.addEventListener('click', printLogHandler);