<template>
<div>
<div class="new-match-section">
<div class="button-orange" v-b-modal.newmatchmodal @click="readPlayers()"><img src="../assets/ny-kamp.svg" class="button-icon">Ny kamp</div>
</div>
<b-modal id="newmatchmodal" title="Legg til ny kamp" cancel-title="Kanseller" ok-title="Opprett kamp">
      <div class="matchheader">
        <div>
         <label for="homescore" class="input-label">Homescore:</label><input type="number" v-model.number="homescore" class="input-number" />
        </div>
        <div>
          <label for="awayscore" class="input-label">Awayscore:</label><input type="number" v-model.number="awayscore" class="input-number"/>
        </div>
        <div>

<!--           <label for="map" class="input-label">Map:</label>
          <div v-for="(map, index) in availableMaps" v-bind:key="index" > {{map.name}}>
            <input type="radio" value="map.name" v-model="map.map">
          </div>
          <label for="" class="input-label">Map:</label> {{map.map}} -->
        <select v-model="map">
          <option v-for="(map, index) in availableMaps" v-bind:key="index"> {{map.name}} </option>
        </select>
          
         Du har valgt: {{map}}

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
          <label for="kills" class="input-label">Kills:</label><input type="number" v-model.number="playerinmatch.kills" class="input-number" />
          </div>
          <div>
          <label for="assists" class="input-label">Assists:</label><input type="number" v-model.number="playerinmatch.assists" class="input-number" />
        </div>
        <div>
          <label for="deaths" class="input-label">Deaths:</label><input type="number" v-model.number="playerinmatch.deaths" class="input-number" />
        </div>
        <div>
          <label for="mvp" class="input-label">MVP:</label><input type="number" v-model.number="playerinmatch.mvp" class="input-number" />
        </div>
        <div>
            <label for="score" class="input-label">Score:</label><input type="number" v-model.number="playerinmatch.score" class="input-number" />
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

import firebase from "../firebase.js";
import {updateMatches} from "../main.js";
const db = firebase.firestore();


export default {
  data() {
    return {
    homescore: 0,
    awayscore: 0,
    date: "",
    createddate: new Date().toISOString().slice(0, 10),
    map: "",
    getPlayers: [],
    playerAddedToMatch: [],
    playerid: "",
    availableMaps: [],
    test: "",
    };
  },
  methods: {
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
        this.getMaps();
    },
    getMaps() {
      this.availableMaps = [],
      db.collection("maps")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.availableMaps.push(doc.data());
        })
      })
      console.log(this.availableMaps);
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
      
        this.homescore = 0,
        this.awayscore = 0,
        this.map = "",
        this.playerAddedToMatch = [];
        updateMatches.$emit('fireMethod');
    },

  },
  mounted() {
    this.readPlayers()
  },
  created() {
        
    },
};
</script>


<style>

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

.button-orange {
  background: #ff5c00;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  padding: 10px;
  display: inline-block;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.button-icon {
  margin-right: 10px;
}

.new-match-section {
  display: flex;
}
</style>