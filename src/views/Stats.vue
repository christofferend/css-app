<template>
  <div id="">
    <Header />
    <b-container>
      <router-link class="" to="/">Home</router-link>
      <h4>Sorter på: </h4>
      <div @click="sortByKills()" class="gray-orange">Kills</div>
      <div @click="sortByDeath()" class="gray-orange">Death</div>
      <div @click="sortByAssits()" class="gray-orange">Assits</div>
      <div @click="sortByMvp()" class="gray-orange">MVP</div>
      <div @click="sortByScore()" class="gray-orange">Score</div>
      <div class="score-list">
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
            class=""
            v-for="(score, index) in playerScores"
            v-bind:key="index"
          >
            <div class="score-list-flex margin-top-6">
              <div class="score-list-score-data-player">{{ score.name }}</div>
              <div class="score-list-score-data">{{ score.kills }}</div>
              <div class="score-list-score-data">{{ score.deaths }}</div>
              <div class="score-list-score-data">{{ score.assists }}</div>
              <div class="score-list-score-data">{{ score.mvp }}</div>
              <div class="score-list-score-data">{{ score.score }}</div>
            </div>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import firebase from "../firebase.js";
const db = firebase.firestore();

export default {
  components: {
    Header,
  },
  data() {
    return {
      name: "stats",
      playerScores: {},
      buttonState: false,
    };
  },
  methods: {
    async readPlayers() {
      (this.allPlayerScores = []),
        await db
          .collection("scores")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.allPlayerScores.push(doc.data());
            });
          });
      //console.log(this.allPlayerScores);
      this.readScores();
    },

    readScores() {
      const dataTotals = Object.values(
        this.allPlayerScores.reduce((a, c) => {
          if (!a[c.player]) {
            a[c.player] = {
              player: c.player,
              kills: c.kills,
              deaths: c.deaths,
              assists: c.assists,
              mvp: c.mvp,
              name: c.name,
              score: c.score,
            };
          } else {
            a[c.player].kills += c.kills;
            a[c.player].deaths += c.deaths;
            a[c.player].assists += c.assists;
            a[c.player].mvp += c.mvp;
            a[c.player].score += c.score;
          }
          return a;
        }, {})
      );

      this.playerScores = dataTotals;

      //console.log(this.playerScores);
    },
    sortByDeath() {
      this.playerScores.sort((a, b) =>
        a.deaths < b.deaths ? 1 : -1
      );
    },
    sortByKills() {
      this.playerScores.sort((a, b) =>
        a.kills < b.kills ? 1 : -1
      )
    },
     sortByAssits() {
      this.playerScores.sort((a, b) =>
        a.assists < b.assists ? 1 : -1
      );
    },
    sortByMvp() {
      this.playerScores.sort((a, b) =>
        a.mvp < b.mvp ? 1 : -1
      );
    },
    sortByScore() {
      this.playerScores.sort((a, b) =>
        a.score < b.score ? 1 : -1
      );
    },
  },
  mounted() {
    this.readPlayers();
  },
};
</script>


<style>
</style>