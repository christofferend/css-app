<template>
  <div>
    <div v-for="(match, index) in matchData" :key="index">
      awayScore: {{ match.awayScore }} - homeScore: {{ match.homeScore }} -
      matchScoresIds: {{ match.matchScoresIds }}
      <button v-on:click="readPlayerScores(homeScore)">Test</button>
    </div>

    <el-table :data="matchData">
      <el-table-column label="awayScore" prop="awayScore"></el-table-column>
      <el-table-column label="homeScore" prop="homeScore"></el-table-column>
      <el-table-column
        label="matchScoresIds"
        prop="matchScoresIds"
      ></el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button @click="readPlayerScores(scope.row.matchScoresIds)"
            >Test</el-button
          >
        </template>
      </el-table-column>
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
      //matchScoresIds: "",
      homeScore: Number,
      awayScore: Number,
    };
  },
  methods: {
    readMatches() {
      return db
        .collection("matches")
        .get()
        .then((queryMatchSnapshot) => {
          this.matchData = [];
          queryMatchSnapshot.forEach((doc) => {
            this.matchData.push({
              id: doc.id,
              awayScore: doc.data().awayscore,
              homeScore: doc.data().homescore,
              matchScoresIds: doc.data().matchscores,
            });
          });
          console.log(this.matchData)
        });
    },
    readPlayerScores(matchScoresIds) {
      console.log(matchScoresIds);
      matchScoresIds.forEach((scores) => {
        db.collection("scores")
          .doc(scores)
          .get()
          .then(function (score) {
            console.log(score.data());
          });
      });
    },
    readMatchPlayerScoreIds() {},
  },
  mounted() {
    this.readMatches().then(() => this.readMatchPlayerScoreIds());
  },
};

// https://blog.logrocket.com/how-to-build-and-deploy-a-vue-js-crud-app-with-cloud-firestore-and-firebase/
</script>

<style>
</style>
