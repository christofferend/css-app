   <template>
  <div>
    <h1>CS app</h1>
    <h2>matchData</h2>

    <div v-for="match in matchData" v-bind:key="match.id">
      {{ match.players }}
      <div v-for="(player, index) in match.players" :key="index">
        {{ index }} - {{ player.playerkills }}-{{ player.playerdeath }}
      </div>
    </div>
    <el-table :data="matchData">
      <el-table-column type="expand"> </el-table-column>
      <el-table-column label="Match ID" prop="id"></el-table-column>
      <el-table-column label="map" prop="map"></el-table-column>
      <el-table-column label="scoreHome" prop="scoreHome"></el-table-column>
      <el-table-column label="scoreAway" prop="scoreAway"></el-table-column>
      <el-table-column label="dateplayed" prop="datePlayed"></el-table-column>
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
    };
  },
  methods: {
    readMatches() {
      this.matchData = [];
      db.collection("match_statistics")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.matchData.push({
              id: doc.id,
              map: doc.data().map,
              scoreAway: doc.data().scoreaway,
              scoreHome: doc.data().scorehome,
              players: doc.data().players,
              datePlayed: doc.data().dateplayed,
            });
            // console.log(doc.id, " => ", doc.data());
          });
          console.log(this.matchData);
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
</style>
