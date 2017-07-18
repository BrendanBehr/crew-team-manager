'use strict';

const crypto = require('crypto');
const Generator = require('./src/generator');

const generator = new Generator();
generator.createTeams(2);

//Creates 2 team objects
const team1 = generator.createTeam();
const team2 = generator.createTeam();
const team3 = generator.createTeam();

//Creates athlete objects
const team1Athlete1 = team1.createAthlete();
const team2Athlete2 = team2.createAthlete();
const team1Athlete3 = team1.createAthlete();
const team1Athlete4 = team2.createAthletes(14);
const team2Athlete5 = team3.createAthletes(25);
const team1Athlete6 = team1.createAthletes(33);

//Cretes a more stuff
const team1Boats = team1.createBoats(2);
team1.createErgs(10);
team1.createFinances(10);
const oars1 = team1.createOars(12);
const races1 = team1.createRaces(16);
team1.createPictures(20);

//Creates user objects for the respective athlete objects

const team1User1 = team1.createUser({
    email: 'babehrensbb@gmail.com'
});
const team2User2 = team2.createUser({
    email: 'behrenb2@tcnj.edu'
});
const team1User3 = team1.createUser({
    email: 'bbehrens@laborsync.com'
});

//Creates email objects for the athlete objects

const email1 = team1User1.createEmail({
    value: team1User1.getValues().email
});
const email2 = team2User2.createEmail({
    value: team2User2.getValues().email
});
const email3 = team1User3.createEmail({
    value: team1User3.getValues().email
});

//Creates a credential object for the first athletes and then sets the relation 
//between the athlete and credential as well as the user and credential
const team1User1Credential1 = team1User1.createCredential();
team1Athlete1.setCredential(team1User1Credential1);
team1User1.setCredential(team1User1Credential1);

//Same as above, but for athlete 2 and 
//athlete 3, using its user object
const team2User2Credential2 = team2User2.createCredential();
team2Athlete2.setCredential(team2User2Credential2);
team2User2.setCredential(team2User2Credential2);
const team1User3Credential3 = team1User3.createCredential();
team1User3.setCredential(team1User3Credential3);
team1Athlete3.setCredential(team1User3Credential3);

//Sets the password for the credentials, hasing them and adding a salt
const password = 'BrendanRocks';
team1User1Credential1.setPassword(password);
team2User2Credential2.setPassword(password);
team1User3Credential3.setPassword(password);

//This creates boat, oar and rigger objects for team1
const team1Boat1 = team1.createBoat();
const team1Oar1 = team1.createOar();

//This adds athletes and oars to boats
team1Boat1.addAthlete(team1Athlete1);
team1Boat1.addAthlete(team1Athlete3);
team1Boat1.removeAthlete(team1Athlete1);

for (let x = 0; x < team1Oar1.length; x++) {
    team1Boat1.addOars(team1Oar1[x]);

}

//This creates regatta and race objects for team1
const team1Regatta1 = team1.createRegatta();
team1.createRegattas(5);

//Creates an erg and finance object for team1
const team1Erg1 = team1.createErg();
const team1Finance1 = team1.createFinance();

//This adds the erg and finance objects to athlete 3
team1Athlete3.addErg(team1Erg1);
team1Athlete3.addFinance(team1Finance1);

for (let x = 0; x < races1.length; x++) {
    team1Regatta1.addRaces(races1[x]);

}

//This creaetes a picture object and adds it to a regatta
const team1Picture1 = team1.createPicture();
team1Regatta1.addPicture(team1Picture1);


const riggers = team1.createRiggers(8);

for (let x = 0; x < riggers.length; x++) {
    team1Boat1.addRigger(riggers[x]);

}
console.log('done');
//This writes the data to the database
generator.writeData();