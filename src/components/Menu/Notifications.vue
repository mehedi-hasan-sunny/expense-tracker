<template>
  <v-card :color="settingsData.darkMode ? '#212121' : '#ffffff'" :dark="settingsData.darkMode" flat>
    <v-toolbar :color="settingsData.darkMode ? '#212121' : '#ffffff'" tabs>
      <v-btn @click="$emit('update:settingsModal', false)" icon>
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title class="justify-center ma-0">Notifications</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-tabs :color="settingsData.darkMode ? '#212121' : '#ffffff'" :slider-color="settingsData.darkMode ?'#ffffff' : '#212121'" centered slot="extension"
              v-model="model">
        <v-tab :href="`#tab-${i}`" :key="i" class="font-weight-bold" v-for="i in 2">
          Item {{ i }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="model">
      <v-tab-item value="tab-1">
        <v-card flat>
          <v-card-text v-text="text"></v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <v-card flat>
          <v-card-text v-text="text"></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
  export default {
    name: "Notifications",
    props: ['settingsData'],
    data() {
      return {
        model: 'tab-1',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      }
    },
    mounted() {
      let instance = this;
      document.addEventListener("backbutton", function () {
        instance.$emit('update:settingsModal', false);
        instance.$eventHub.$emit('resetCounter',0);
      },false);
    }
  }
</script>

<style scoped>
  .theme--dark.v-tabs__bar {
    background-color: transparent;
  }

  .theme--dark.v-sheet {
    background-color: transparent;
  }
</style>
