<template>
  <div>
    <h1>CS app</h1>
    <h2>readPlayers</h2>
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

  <h2>readMatchStats</h2>
    <el-table :data="matchData">
      <el-table-column label="matchDate" prop="matchDate"></el-table-column>
      <el-table-column label="map" prop="map"></el-table-column>
      <el-table-column label="homeScore" prop="homeScore"></el-table-column>
      <el-table-column label="awayScore" prop="awayScore"></el-table-column>
    </el-table>
  <h2>readPlayerMatchStats</h2>
    <el-table :data="playerMatchStats">
      <el-table-column label="playerDeath" prop="playerDeath"></el-table-column>
      <el-table-column label="playerKills" prop="playerKills"></el-table-column>
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
      matchData: [],
      playersData: [],
      playerMatchStats: [],
    };
  },
  methods: {
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
            //console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    },
      readMatchStats() {
      this.matchData = [];
      db.collection("match_stats")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.matchData.push ({
            id: doc.id,
            matchDate: doc.data().date,
            map: doc.data().map,
            homeScore: doc.data().scorehome,
            awayScore: doc.data().scoreaway,
            
          });
          console.log(doc.id, " => ", doc.data());
        });
      })
    },
    readPlayerMatchStats() {
      this.playerMatchStats = [];
      db.collection("player_match_stats")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.playerMatchStats.push ({
            id: doc.id,
            playerDeath: doc.data().playerdeath,
            playerKills: doc.data().playerkills,
          });
          console.log(doc.id, " => ", doc.data());
        })
      })
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
