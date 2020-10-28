<template>
  <div id="home">
    <Header />
    <b-container>
      <h3>KAMPER</h3>
      <div class="new-match-section">
        <div class="button-orange" v-b-modal.newmatchmodal @click="readPlayers()"><img src="./assets/ny-kamp.svg" class="button-icon">Ny kamp</div>
      </div>
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
            <img src="./assets/delete.png" alt="">
          </div>
        </div>
      </div>
    </b-container>
    <b-modal id="newmatchmodal" title="Legg til ny kamp" cancel-title="Kanseller" ok-title="Opprett kamp">
      <div class="matchheader">
        <div>
         <label for="homescore" class="input-label">Homescore:</label><input type="number" v-model="homescore" class="input-number" />
        </div>
        <div>
          <label for="awayscore" class="input-label">Awayscore:</label><input type="number" v-model="awayscore" class="input-number"/>
        </div>
        <div>
          <label for="map" class="input-label">Map:</label><input type="text" v-model="map" class="input-number" />
        </div>      
      </div>
        <label for="datepicker" class="input-label"> Dato:</label><b-form-datepicker id="datepicker" v-model="date"></b-form-datepicker>
      <div id="addplayertomatch">
        <b-dropdown text="Legg til spiller" class="btn-addplayer">
        <b-dropdown-item
          v-for="(player, index) in getPlayers"
          v-bind:key="index"
          @click="addPlayerToMatch(player.name, player.playerid)"
        >
          {{ player.name }}
        </b-dropdown-item>
      </b-dropdown>
    </div>
      <div class="playersaddedtomatch">
        <div v-for="(playerinmatch, index) in playerAddedToMatch" v-bind:key="index">
          <h4>{{ playerinmatch.name }} </h4>
          <div>
          <label for="kills" class="input-label">Kills:</label><input type="number" v-model="playerinmatch.kills" class="input-number" />
          </div>
          <div>
          <label for="assists" class="input-label">Assists:</label><input type="number" v-model="playerinmatch.assists" class="input-number" />
        </div>
        <div>
          <label for="deaths" class="input-label">Deaths:</label><input type="number" v-model="playerinmatch.deaths" class="input-number" />
        </div>
        <div>
          <label for="mvp" class="input-label">MVP:</label><input type="number" v-model="playerinmatch.mvp" class="input-number" />
        </div>
        <div>
            <label for="score" class="input-label">Score:</label><input type="number" v-model="playerinmatch.score" class="input-number" />
        </div>
      </div>
    </div>
    <div class="create-match-button-section">
      <div
      @click="createMatch(homescore, awayscore, map, playerid, date)"
      class="button-orange">Legg til kamp
      </div>
   </div> 
   
    </b-modal>
  </div>
</template>

<script>
import firebase from "firebase";
import Header from "./components/Header.vue";

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
  components: {
    Header,
  },
  data() {
    return {
      matchData: {},
      newArray: [],
      name: "",
      nickname: "",
      homescore: null,
      awayscore: null,
      date: "",
      createddate: new Date().toISOString().slice(0, 10),
      map: "",
      playerid: "",
      getPlayers: [],
      playerAddedToMatch: [],
      scoreIds: [],
      kills: null,
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
    readPlayers() {
      this.getPlayers = [];
      db.collection("players")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.getPlayers.push({
              playerid: doc.id,
              name: doc.data().name,
              nickname: doc.data().nickname,
            });
          });
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    },
    addPlayerToMatch(name, playerid, assists, deaths, kills, mvp, score) {
      this.playerAddedToMatch.push({
        name: name,
        player: playerid,
        assists: assists,
        deaths: deaths,
        kills: kills,
        mvp: mvp,
        score: score,
      });
    },
    async createMatch(homescore, awayscore, map, date, createddate) {
      const promiseIds = this.playerAddedToMatch.map(async (id) => {
        const promise = await db.collection("scores").add(id);
        return promise.id;
      });
      const scoreIds = await Promise.all(promiseIds);
      db.collection("matches").add({
        homescore: homescore,
        awayscore: awayscore,
        map: map,
        matchscores: scoreIds,
        date: date,
        createddate: createddate,
      });
      this.readMatches();
      (this.homescore = null),
        (this.awayscore = null),
        (this.map = ""),
        (this.playerAddedToMatch = []);
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
        }).then(() => {
          this.readMatches();
        }); 
    },
  },
  mounted() {
    this.readMatches();
    this.readPlayers()
  },
};

// https://blog.logrocket.com/how-to-build-and-deploy-a-vue-js-crud-app-with-cloud-firestore-and-firebase/
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

body {
 font-family: "Roboto", Helvetica, Arial;
}

h1 {
  color: #fff;
  font-size: 28px;
}

h2 {
  color: #fff;
  font-size: 24px;
}

h3 {
  color: #fff;
  font-size: 20px;
}

h4 {
  color: #fff;
  font-size: 18px;
}

#home {
  background-color: #596267;
  padding-bottom: 50px;
}

.new-match-section {
  display: flex;
}

.button-orange {
  background: #ff5c00;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  padding: 10px;
  display: inline-block;
  color: #fff;
  font-size: 14px;
}

.score-list {
  background: #22282c;
  border-radius: 12px;
  color: #fff;
  margin-top: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
}

.score-list-flex {
  display: flex;
  text-align: center;
}

.score-list-header {
  opacity: 0.5;
  border-bottom: 1px solid #f7e3e3;
  padding: 12px;
}

.score-list-score {
  padding: 12px;
}

.score-list-header-title {
  width: 25%;
  font-size: 10px;
  color: #b0b1b2;
}
.score-list-header-data {
  width: 25%;
  font-size: 12px;
  color: #ffffff;
}

.score-list-score-title {
  width: 15%;
  font-size: 10px;
  color: #b0b1b2;
}

.score-list-score-title-player {
  width: 25%;
  font-size: 10px;
  color: #b0b1b2;
}

.score-list-score-data {
  width: 15%;
  font-size: 12px;
  color: #ffffff;
  padding-top: 15px;
}
.score-list-score-data-player {
  width: 25%;
  font-size: 12px;
  color: #ffffff;
  padding-top: 15px;
}

.margin-top-6 {
  margin-top: 6px;
}

.input-number {
  width: 100px;;
}

.input-label {
  width: 60px;
  margin-right: 40px;
  margin-bottom: 10px;
}

.playersaddedtomatch {
  margin-top: 30px;
}

.modal-content {
  background-color:#22282c !important;
  color: #fff;
}

.modal-header {
  color: #fff;
  border-bottom-color: #f7e3e3 !important;
}

.close {
  color:#fff !important;
}

.btn-addplayer {
  margin-top: 30px;
}

.modal-footer {
  display: none !important;
}

.create-match-button-section {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

.button-icon {
  margin-right: 10px;
}

.delete-icon {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}


</style>
