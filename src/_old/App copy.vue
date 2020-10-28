<template>
  <div>
    <h1>CS app</h1>
    <h2>Spillere</h2>
    <el-table :data="playersData">
      <el-table-column label="Name" prop="name"></el-table-column>
      <el-table-column label="Playername" prop="playerName"></el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            title="Rediger spiller"
            trigger="click"
          >
            <el-input label="Navn" v-model="scope.row.name"></el-input>
            <el-input
              label="Playername"
              v-model="scope.row.playerName"
            ></el-input>
            <el-button
              type="primary"
              @click="
                updatePlayer(
                  scope.row.id,
                  scope.row.name,
                  scope.row.playerName
                )
              "
              >Oppdater</el-button
            >
            <el-button size="mini" slot="reference">Rediger</el-button>
          </el-popover>
          <el-button
            size="mini"
            type="danger"
            @click="deletePlayer(scope.row.id)"
            >Slett</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <h2>Opprett ny spiller:</h2>
    <el-form>
      <el-form-item label="Navn">
        <el-input v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="Navn i steam">
        <el-input v-model="playerName"></el-input>
      </el-form-item>
      <el-button type="primary" @click="createPlayer(name, playerName)"
        >Create</el-button
      >
    </el-form>

  <h2>Kamper</h2>
    <el-table :data="matchData">
      <el-table-column label="Dato" prop="matchDate"></el-table-column>
      <el-table-column label="Kart" prop="map"></el-table-column>
      <el-table-column label="Vår score" prop="homeScore"></el-table-column>
      <el-table-column label="Konkurent score" prop="awayScore"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyD-BFxh4Gk7hxA1_kIYj6gZNhXFmSwwvZs",
  authDomain: "cs-app-831a7.firebaseapp.com",
  databaseURL: "https://cs-app-831a7.firebaseio.com",
  projectId: "cs-app-831a7",
  storageBucket: "cs-app-831a7.appspot.com",
  messagingSenderId: "44627263456",
  appId: "1:44627263456:web:81f91e87615d546d587585",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default {
  data() {
    return {
      name: "",
      playerName: "",
      map: "",
      homeScore: 0,
      awayScore: Number,
      matchDate: new Date().toISOString().slice(0, 10),
      matchId: 0,
      matchData: [],
      playersData: [],
      playerMatchId: Number,

    };
  },
  methods: {
    readPlayerMatchStats() {
      this.playerMatchStats = [];
      db.collection("player_match_stats")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.playerMatchStats.push ({
            id: doc.id,
            matchId: doc.data().matchid,
            playerDeath: doc.data().playerdeath,
            playerId: doc.data().playerid,
            playerKills: doc.data().playerkills,
          });
          console.log(doc.id, " => ", doc.data());
        })
      })
    },

    readMatchStats() {
      this.matchData = [];
      db.collection("match_stats")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.matchData.push({
            id: doc.id,
            matchDate: doc.data().date,
            map: doc.data().map,
            homeScore: doc.data().homescore,
            awayScore: doc.data().awayscore,
          });
          console.log(doc.id, " => ", doc.data());
          console.log(this.matchData);
        });
      })
    },
    deletePlayer(id) {
      db.collection("players")
        .doc(id)
        .delete()
        .then(() => {
          this.readPlayers();
        })
        .catch((error) => {
          console.error("Error ", error);
        });
    },
    readPlayers() {
      this.playersData = [];
      db.collection("players")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.playersData.push({
              id: doc.id,
              name: doc.data().name,
              playerName: doc.data().playername,
            });
            console.log(doc.id, " => ", doc.data());
            console.log(this.playersData);
          });
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    },
    createPlayer(name, playerName) {
      console.log(name + playerName);
      db.collection("players").add({ name: name, playername: playerName });
      this.readPlayers();
      this.name = "";
      this.playerName = "";
    },
    updatePlayer(id, name, playerName) {
      db.collection("players")
        .doc(id)
        .update({
          name: name,
          playername: playerName,
        })
        .then(() => {
          this.readPlayers();
        });
    },
  },
  mounted() {
    
    this.readPlayers();
    this.readMatchStats();
    this.readPlayerMatchStats();
  },
};

// https://blog.logrocket.com/how-to-build-and-deploy-a-vue-js-crud-app-with-cloud-firestore-and-firebase/
</script>

<style>
</style>
