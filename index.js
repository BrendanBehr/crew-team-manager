'use strict';

const crypto = require('crypto');
const Generator = require('./src/generator');

const generator = new Generator();
generator.createTeams(100);

//Creates 2 team objects
const team1 = generator.createTeam();
const team2 = generator.createTeam();
const team3 = generator.createTeam();

//Creates 3 athletes objects, the first and third athlete belong to the
//first team object, the second athlete belongs to the second team object
const team1Athlete1 = team1.createAthlete();
const team2Athlete2 = team2.createAthlete();
const team1Athlete3 = team1.createAthlete();
const team1Athlete4 = team2.createAthlete();
const team2Athlete5 = team3.createAthlete();
const team1Athlete6 = team2.createAthlete();

//Cretes a shit ton of everything
team1.createAthletes(100);
const team1Boats = team1.createBoats(50);
team1.createErgs(100);
team1.createFinances(100);
team1.createOars(100);
team1.createRaces(100);
team1.createErgs(500);
team1.createPictures(100);

for (let x = 0; x < team1Boats.length; x++) {
    team1Boats[x].createRiggers(8);
}
//Creates user objects for the respective athlete objects
const team1User1 = team1Athlete1.createUser();
const team2User2 = team2Athlete2.createUser();
const team1User3 = team1Athlete3.createUser();

//Creates email objects for the athlete objects
const email1 = team1Athlete1.createEmail();
const email2 = team2Athlete2.createEmail();

//Creates a credential object for the first athletes and then sets the relation 
//between the athlete and credential as well as the user and credential
const team1Athlete1Credential1 = team1Athlete1.createCredential();
team1Athlete1.setCredential(team1Athlete1Credential1);
team1User1.setCredential(team1Athlete1Credential1);

//Same as above, but for athlete 2 and 
//athlete 3, using its user object
const team2Athlete2Credential2 = team2User2.createCredential();
team2Athlete2.setCredential(team2Athlete2Credential2);
team2User2.setCredential(team2Athlete2Credential2);
const team1Athlete3Credential3 = team1User3.createCredential();
team1Athlete3.setCredential(team1Athlete3Credential3);
team1Athlete3.setCredential(team1Athlete3Credential3);

//Sets the password for the credentials, hasing them and adding a salt
team1Athlete1Credential1.setPassword('12345678');
team2Athlete2Credential2.setPassword('098765432');
team1Athlete3Credential3.setPassword('BrendanRocks');

//This creates boat, oar and rigger objects for team1
const team1Boat1 = team1.createBoat();
const team1Oar1 = team1.createOar();
const team1Rigger1 = team1Boat1.createRigger();
//team1Boat1.createRiggers(100);

//This adds athletes and oars to boats
team1Boat1.addAthlete(team1Athlete1);
team1Boat1.addAthlete(team1Athlete3);
team1Boat1.removeAthlete(team1Athlete1);
team1Boat1.addOar(team1Oar1);

//This creates regatta and race objects for team1
const team1Regatta1 = team1.createRegatta();
team1.createRegattas(100);
const team1Race1 = team1.createRace();

//This adds race objects to regattas
team1Regatta1.addRace(team1Race1);

//Creates an erg and finance object for team1
const team1Erg1 = team1.createErg();
const team1Finance1 = team1.createFinance();

//This adds the erg and finance objects to athlete 3
team1Athlete3.addErg(team1Erg1);
team1Athlete3.addFinance(team1Finance1);

//This creaetes a picture object and adds it to a regatta
const team1Picture1 = team1.createPicture();
team1Regatta1.addPicture(team1Picture1);

//This writes the data to the database
generator.writeData();