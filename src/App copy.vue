<template>
  <div id="home">
    <div id="header"></div>
    <b-container>
      <h1>KAMPER</h1>
      <div class="new-match-section">
        <div class="button-orange">Ny kamp</div>
      </div>
      <div
        class="score-list"
        v-for="(match, index) in matchData"
        v-bind:key="index">
        <div class="score-list-header">
          <div class="score-list-flex">
            <div class="score-list-header-title">Dato</div>
            <div class="score-list-header-title">Oss</div>
            <div class="score-list-header-title">Fiende</div>
            <div class="score-list-header-title">Map</div>
          </div>
          <div class="score-list-flex">
            <div class="score-list-header-data">{{ match.createddate }}</div>
            <div class="score-list-header-data">{{ match.homescore }}</div>
            <div class="score-list-header-data">{{ match.awayscore }}</div>
            <div class="score-list-header-data">{{ match.map }}</div>
          </div>
        </div>
          <div class="score-list-score" v-for="(score, index2) in match.playerDetails" v-bind:key="index2">
            <div class="score-list-flex">
                <div class="score-list-score-title-player">Spiller</div>
                <div class="score-list-score-title">K</div>
                <div class="score-list-score-title">A</div>
                <div class="score-list-score-title">D</div>
                <div class="score-list-score-title">MVP</div>
                <div class="score-list-score-title">Score</div>
            </div>
            <div class="score-list-flex">
              <div class="score-list-score-data-player">{{ score.name }}</div>
              <div class="score-list-score-data">{{ score.kills }}</div>
              <div class="score-list-score-data">{{ score.deaths }}</div>
              <div class="score-list-score-data">{{ score.assists }}</div>
              <div class="score-list-score-data">{{ score.mvp }}</div>
              <div class="score-list-score-data">{{ score.score }}</div>
            </div>
          </div>
      </div>
    </b-container>
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
      matchData: {},
      id: "",
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
  },
  mounted() {
    this.readMatches();
  },
};

// https://blog.logrocket.com/how-to-build-and-deploy-a-vue-js-crud-app-with-cloud-firestore-and-firebase/
</script>

<style>
h1 {
  color: #fff;
}

#home {
  background-color: #596267;
  height: 100vh;
}
#header {
  width: 100%;
  height: 50px;
  background-color: #22282c;
}

.new-match-section {
  display: flex;
}

.button-orange {
  background: #ff5c00;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  padding: 8px;
  display: inline-block;
  color: #fff;
  font-size: 12px;
}

.score-list {
  background: #22282c;
  border-radius: 12px;
  color: #fff;
  margin-top: 10px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);

}

.score-list-flex {
  display: flex;
  text-align: center;
}

.score-list-header {
  opacity: 0.5;
  border-bottom: 1px solid #979797;
  padding: 12px;
}

.score-list-score {
  padding: 12px;
}

.score-list-header-title {
  width: 25%;
  font-size: 10px;
  color: #B0B1B2;
}
.score-list-header-data {
  width: 25%;
  font-size: 12px;
  color: #FFFFFF; 
}

.score-list-score-title {
  width: 15%;
  font-size: 10px;
  color: #B0B1B2;
}

.score-list-score-title-player {
  width: 25%;
  font-size: 10px;
  color: #B0B1B2;
}

.score-list-score-data {
  width: 15%;
  font-size: 12px;
  color: #FFFFFF;
  padding-top: 15px;
}
.score-list-score-data-player {
  width: 25%;
  font-size: 12px;
  color: #FFFFFF;
  padding-top: 15px;
}

</style>
