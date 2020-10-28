<template>
  <div>
    <div v-for="(match, index) in matchData" :key="index">
      {{ match.awayscore }} - {{ match.homescore }}
    </div>
      <div v-for="(players, index) in wholeData" :key="index">
      {{ players.kills }} - {{ players.deaths }}
    </div>

    <el-table :data="wholeData">
      <el-table-column type="expand"> </el-table-column>
      <el-table-column label="kills" prop="kills"></el-table-column>

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
      playerScores: [],
      wholeData: [],
    };
  },
  methods: {
    readMatches() {
      db.collection("matches")
        .get()
        .then((queryMatchSnapshot) => {
          queryMatchSnapshot.forEach((doc) => {

            this.matchData.push(doc.data());
            

            this.matchPlayerScores = [];
            doc.data().scores.forEach((scores) => {
              this.matchPlayerScores.push(scores.id);
            });

            var matchPlayerScoresTostring = this.matchPlayerScores.toString();
            
            var wholeData = [];
            db.collection("scores").doc(matchPlayerScoresTostring).get().then(function(doc){
              wholeData.push(doc.data());
            });
            console.log(wholeData)
          });
        });
        console.log(this.matchData);
    },
    
  },
  mounted() {
    this.readMatches();
  },
};

// https://blog.logrocket.com/how-to-build-and-deploy-a-vue-js-crud-app-with-cloud-firestore-and-firebase/
</script>

<style>
</style>
