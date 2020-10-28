<template>
  <div>
    <div
      class="score-list"
      v-for="(match, index) in matchData"
      v-bind:key="index"
    >
      <div class="score-list-header">
        <div class="score-list-flex">
          <div class="score-list-header-title">Dato</div>
          <div class="score-list-header-title">Oss</div>
          <div class="score-list-header-title">Fiende</div>
          <div class="score-list-header-title">Map</div>
        </div>
        <div class="score-list-flex margin-top-6">
          <div class="score-list-header-data">{{ match.createddate }}</div>
          <div class="score-list-header-data">{{ match.homescore }}</div>
          <div class="score-list-header-data">{{ match.awayscore }}</div>
          <div class="score-list-header-data">{{ match.map }}</div>
        </div>
      </div>
      <div class="score-list-score">
        <div class="score-list-flex">
          <div class="score-list-score-title-player">Spiller</div>
          <div class="score-list-score-title">K</div>
          <div class="score-list-score-title">A</div>
          <div class="score-list-score-title">D</div>
          <div class="score-list-score-title">MVP</div>
          <div class="score-list-score-title">Score</div>
        </div>
        <div
          class="score-list-flex margin-top-6"
          v-for="(score, index2) in match.playerDetails"
          v-bind:key="index2"
        >
          <div class="score-list-score-data-player">{{ score.name }}</div>
          <div class="score-list-score-data">{{ score.kills }}</div>
          <div class="score-list-score-data">{{ score.deaths }}</div>
          <div class="score-list-score-data">{{ score.assists }}</div>
          <div class="score-list-score-data">{{ score.mvp }}</div>
          <div class="score-list-score-data">{{ score.score }}</div>
        </div>
        <div class="delete-icon" @click="deleteMatch(match.id)">
          <img src="../assets/delete.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "../firebase.js";
const db = firebase.firestore();
import {updateMatches} from "../main.js";

export default {
  data() {
    return {
      matchData: {},
    };
  },
  methods: {
    readMatches() {
      return db
        .collection("matches")
        .get()
        .then(async (queryMatchSnapshot) => {
          let array = [];
          queryMatchSnapshot.forEach((doc) =>
            array.push({
              id: doc.id,
              awayscore: doc.data().awayscore,
              homescore: doc.data().homescore,
              map: doc.data().map,
              matchscores: doc.data().matchscores,
              date: doc.data().date,
              createddate: doc.data().createddate,
              //timestamp: doc.data().timestamp.toDate(),
            })
          );
          const matchPromises = array.map(async (data) => {
            const promises = data.matchscores.map(async (scoreId) => {
              const score = await db.collection("scores").doc(scoreId).get();
              return score.data();
            });
            const scores = await Promise.all(promises);
            const array = Object.values(scores);
            const playerPromise = array.map(async (ids) => {
              const playerIds = ids["player"];
              const player = await db
                .collection("players")
                .doc(playerIds)
                .get();
              return player.data();
            });
            const playerNames = await Promise.all(playerPromise);
            let playerDetails = [];
            playerNames.forEach(function (value, i) {
              let combined = { ...playerNames[i], ...scores[i] };
              playerDetails.push(combined);
            });
            return { ...data, playerDetails };
          });
          const matches = await Promise.all(matchPromises);
          this.matchData = matches;
        });
    },
    deleteMatch(id) {
      this.getMatchScores = [];
      db.collection("matches")
        .doc(id)
        .get()
        .then((doc) => {
          this.getMatchScores.push(doc.data());
          console.log("getMatchScores", this.getMatchScores);
          this.getMatchScores.map((scoreIds) => {
            scoreIds.matchscores.map((test) => {
              db.collection("scores").doc(test).delete();
            });
          });
        })
        .then(() => {
          db.collection("matches").doc(id).delete();
        })
        .then(() => {
          this.readMatches();
        });
    },
  },
  mounted() {
    this.readMatches();
  },
  created() {
    updateMatches.$on('fireMethod', () => {
            this.readMatches();
    })
}
};
</script>


<style>

</style>