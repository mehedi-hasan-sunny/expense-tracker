<template>
  <v-app :class="{'white-mode': !settingsData.darkMode}" id="app">
    <v-toolbar :color="settingsData.darkMode ? '#212121' : '#ffffff'" :dark="settingsData.darkMode" app clipped-right fixed>
      <v-spacer></v-spacer>
      <v-toolbar-title class="ma-0">{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <div class="toolbar-menu-btn">
      <v-btn :dark="settingsData.darkMode" @click="menu = true" flat icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </div>

    <v-content pa-0 v-touch="{ left: () => swipe('Left'), right: () => swipe('Right')}">
      <v-container fill-height fluid pa-0>
        <router-view :settingsData="settingsData"></router-view>
      </v-container>
    </v-content>

    <v-footer :color="settingsData.darkMode ? '#212121' : '#ffffff'" :dark="settingsData.darkMode" app class="border-top"
              id="btm-hider">
      <v-layout class="ma-0" row>
        <v-flex :class="{'active-tab': link.route===$route.path}" :key="link.icon" @click.prevent="title = link.title, goToRoute(link.route)"
                class="tab-icon" v-for="link in links"
                v-ripple xs4>
          <i class="small material-icons">{{link.icon}}</i>
          <small>{{link.title}}</small>
        </v-flex>
      </v-layout>
    </v-footer>
    <v-bottom-sheet v-model="menu">
      <Menu :menu.sync="menu" :menuComponent.sync="menuComponent" :settingsData="settingsData"
            :settingsModal.sync="settingsModal" v-if="menu"></Menu>
    </v-bottom-sheet>

    <v-dialog fullscreen hide-overlay lazy transition="dialog-bottom-transition" v-model="settingsModal">
      <!--<v-card flat :color="settingsData.darkMode ? '#414345' : '#ffffff'" :dark="settingsData.darkMode">-->
      <!---->
      <!--</v-card>-->
      <component :is="menuComponent" :settingsData="settingsData" :settingsModal.sync="settingsModal"></component>
    </v-dialog>

  </v-app>
</template>

<script>
  import Storage from './services/storage';
  const storage = new Storage();

   import Menu from './components/Menu/Menu';
  // import Notifications from './components/Menu/Notifications';
  // import Settings from './components/Menu/Settings';

  var count = 0;
  export default {
    name: 'App',
    props: {
      source: String
    },
    components: {
       Menu,
      // Notifications,
      // Settings
    },
    data() {
      return {
        title: 'Dashboard',
        links: [
          {icon: 'web', title: 'Dashboard', route: '/'},
          {icon: 'date_range', title: 'Monthly', route: '/MonthlyExpense'},
          {icon: 'event', title: 'Daily', route: '/DailyExpense'},
          // {icon: 'layers', title: 'Tab', route: '/tab'},
        ],
        settingsData: {},
        menu: false,
        menuComponent: null,
        settingsModal: false,
        counter: count,
      }
    },
    created() {
      let instance = this;
      this.title = this.$route.name;
      this.getSettingsData();
      this.$eventHub.$on('resetCounter',function (value) {
        count = value;
      })
    },
    mounted() {

      Notification.requestPermission().then(function (result) {
        console.log(result);
      });
      //document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);


    },
    methods: {

      getSettingsData() {
        storage.get('settingsData').then((value) => {
          if (value != null) {
            this.settingsData = JSON.parse(value);
          }
          this.checkLaunchDetails();
        });
      },

      swipe(direction) {
        let instance = this;
        for (var i = 0; i < this.links.length; i++) {
          if (this.$route.path === this.links[i].route) {
            if (direction === 'Left') {
              if (i < instance.links.length - 1) {
                this.goToRoute(this.links[i + 1].route);
                break;
              }
            } else if (direction === 'Right') {
              if (i > 0) {
                this.goToRoute(this.links[i - 1].route)
                break;
              }
            }
          }
        }
      },

      goToRoute(link) {
        this.$router.push({path: link})
      }
      ,
      routeChange() {
        this.title = this.$route.name;
        //let instance = this;
        // document.addEventListener("backbutton", function () {
        //   if(instance.menu)
        //   {
        //     if(instance.settingsModal)
        //     {
        //       instance.settingsModal = false;
        //     }
        //     instance.menu = false;
        //   }
        // });
        //document.querySelector('#btm-hider').removeAttribute("style");
        //console.log(this.$route);
      },
      checkLaunchDetails() {
        let instance = this;

        document.addEventListener('deviceready', function () {

          document.addEventListener("backbutton", function () {
            count++;
            setInterval(function () {
              count = 0;
            }, 800)
            if (count == 2) {
              navigator.app.exitApp();
            }
          }, false);

          if (instance.settingsData.darkMode) {
            StatusBar.backgroundColorByHexString('#212121');
            StatusBar.styleBlackOpaque();
            NavigationBar.backgroundColorByHexString('#212121');
          } else {
            StatusBar.backgroundColorByHexString('#ffffff');
            StatusBar.styleDefault();
            NavigationBar.backgroundColorByHexString('#ffffff');
          }

          let localNotification = cordova.plugins.notification.local;
          if (localNotification.launchDetails) {
            if (localNotification.launchDetails.id == 1) {
              instance.goToRoute('/DailyExpense');
            }else if (localNotification.launchDetails.id === 2) {
              instance.$router.push({path: '/MonthLyExpense'});
            }
          }
          localNotification.on("click", function (notification) {
            if (notification.id === 2) {
              instance.$router.push({path: '/MonthLyExpense'});
            } else if (notification.id === 1) {
              instance.$router.push({path: '/DailyExpense'});
            }
          });
        }, false);
      }
    },
    watch: {
      $route: 'routeChange',
      menu: function (value) {
        let instance = this;
        if (!value) {
          // instance.count = 0;
          document.querySelector("body").removeAttribute('style');
          setTimeout(function () {
            // StatusBar.backgroundColorByHexString('#414345');
            // NavigationBar.backgroundColorByHexString('#212121');
            if (instance.settingsData.darkMode) {
              StatusBar.backgroundColorByHexString('#212121');
              StatusBar.styleBlackTranslucent();
              NavigationBar.backgroundColorByHexString('#212121')
            } else {
              StatusBar.backgroundColorByHexString('#ffffff');
              StatusBar.styleDefault();
              NavigationBar.backgroundColorByHexString('#FFFFFF');
            }
          }, 150);

        } else {
          document.querySelector("body").setAttribute('style', 'position: fixed; width: 100%;');

          // setTimeout(function () {
          //   if (!instance.settingsData.darkMode) {
          //     StatusBar.backgroundColorByHexString('#999999');
          //     StatusBar.styleBlackTranslucent();
          //   }
          // }, 150);

          setTimeout(function () {
            if (instance.settingsData.darkMode) {
              NavigationBar.backgroundColorByHexString('#414345');
            }
          }, 100);
        }
      },
      settingsModal(value) {
        console.log(value);
        let instance = this;
        if (!value) {
          //instance.count = 0;
          this.$eventHub.$emit('checkSettingsModalOpen', false);
          this.getSettingsData();
          //document.querySelector("body").removeAttribute('style');
          setTimeout(function () {
            if (!instance.settingsData.darkMode) {
              //StatusBar.backgroundColorByHexString('#999999');
              //StatusBar.styleBlackTranslucent();
              NavigationBar.backgroundColorByHexString('#FFFFFF');
            } else {
              NavigationBar.backgroundColorByHexString('#414345');
            }
          }, 50);
          // setTimeout(function () {
          //   // StatusBar.backgroundColorByHexString('#414345');
          //   // NavigationBar.backgroundColorByHexString('#212121');
          //   instance.settingsData.darkMode ? NavigationBar.backgroundColorByHexString('#414345') : NavigationBar.backgroundColorByHexString('#FFFFFF');
          // },50);
        } else {
          // NavigationBar.backgroundColorByHexString('#414345');
          //document.querySelector("body").setAttribute('style','position: fixed; width: 100%;');
          setTimeout(function () {
            instance.settingsData.darkMode ? NavigationBar.backgroundColorByHexString('#212121') : NavigationBar.backgroundColorByHexString('#FFFFFF');
            ;
          }, 100)
          setTimeout(function () {
            if (instance.settingsData.darkMode) {
              StatusBar.backgroundColorByHexString('#212121');
              StatusBar.styleBlackTranslucent();
            } else {
              StatusBar.backgroundColorByHexString('#FFFFFF');
              StatusBar.styleDefault();
            }
          }, 200);

        }
      }
    }
  }
</script>

<style lang="scss">
  html {
    overflow-y: auto;
  }

  $app-color: #2c3e50;


  .top-toolbar {
    ion-header {
      ion-toolbar {
        --background: #2c3e50;

        ion-menu-button, ion-title {
          color: #fff;
        }
      }
    }

  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    //color: $app-color;
    //background: linear-gradient(to top, #0f2027, #203a43, #2c5364);
    //background: linear-gradient(to top, #212121, #414345);
    background: #212121;

    &.white-mode {
      background: #fff !important;
    }
  }


  .fixed-bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .tab-icon {
    //flex-grow: 1;
    height: 56px;
    color: #909090;

    &.active-tab {
      color: #8281F8;
    }

    * {
      display: flex;
      justify-content: center;
      /* align-self: center;    <---- REMOVE */
      align-items: center; /* <---- NEW    */
      width: 100%;
    }

    i {
      // display: table-header-group;
      font-size: 1.35rem;
      line-height: 36px;
    }

    small {
      // display: table-footer-group;
      line-height: 10px;
    }
  }


  .card-rounded {
    border-radius: 10px;
  }

  .menu-btn {
    position: absolute;
    left: 0;
    z-index: 99;
    padding: 12px 6px;
    top: 0;
  }

  .modal {
    background-color: #fff !important;
  }

  .app-text {
    color: $app-color;
  }

  .v-content {
    padding-bottom: 56px !important;
  }

  .v-footer {
    height: 56px !important;
    //background: #212121 !important;
  }

  .theme--light.border-top {
    border-top: 1px solid rgba(0, 0, 0, .12) !important;
  }

  .theme--dark.border-top {
    border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
  }

  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }

  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

  .toolbar-menu-btn {
    position: fixed;
    top: 0.32rem;
    z-index: 3;
    right: 0;
  }

  .toolbar-menu {
    &.fixed {
      position: fixed;
    }
  }

  .modal-form {
    border-top-left-radius: 15px !important;
    border-top-right-radius: 15px !important;
    max-height: 85% !important;
  }

  .menu-items {
    .v-list__tile {
      padding: 0 !important;
    }
  }

  nav.v-toolbar {
    border-top-left-radius: 0px !important;
    border-top-right-radius: 0px !important;
  }

  .v-btn:hover:before {
    background-color: transparent !important;
  }

  a.v-list__tile--link:hover {
    background: transparent !important;
  }

  .v-tabs__slider {
    height: 3px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .theme--dark.v-list {
    background: transparent !important;
    transition: none;
  }

  .theme--light.v-list {
    background: transparent !important;
    transition: none;
  }
</style>
