<template>
  <div id="home">
    <Header />
    <b-container>
      <h3>KAMPER</h3>
      <CreateMatch/>
      <ScoreList/>
    </b-container>
  </div>  
</template>

<script>

import Header from "./components/Header.vue";
import ScoreList from "./components/ScoreList.vue";
import CreateMatch from "./components/CreateMatch.vue";

export default {
  components: {
    Header,
    ScoreList,
    CreateMatch,
  },
  data() {
    return {
      name: "App",
    }
  },
  methods: {
    
  },
  mounted() {

  },
};

// https://blog.logrocket.com/how-to-build-and-deploy-a-vue-js-crud-app-with-cloud-firestore-and-firebase/
</script>

<style>

</style>
