<template>
  <v-layout column class="justify-center align-center">
    <v-flex pa-3>
      <v-btn @click="daily()" class="btn">Check Notification</v-btn>
      <!--<v-btn @click="androidNotification(1)" class="btn">Daily Notification</v-btn>-->
      <!--<v-btn @click="androidNotification(2)" class="btn">Monthly Notification</v-btn>-->
    </v-flex>

    <h5>{{day}}
      <br>
      <span v-for="m in da">
        {{m}}
      </span>
    </h5>
    <v-flex xs12>
      Testing Geo location <br><br>

      accuracy  = {{geo.accuracy}}<br>
      latitude  = {{geo.latitude}}<br>
      longitude  = {{geo.longitude}}<br>
    </v-flex>
  </v-layout>
</template>

<script>

  export default {
    name: "DailyExpense",
    data(){
      return{
        geo: {},
        // day: moment().format('DD-MMMM-YYYY'),
        // da: moment().toArray(),
        notification: {},
    }
    },
    created(){
      this.getPlatformType();
    },
    mounted(){
      var instance = this;
      navigator.geolocation.getCurrentPosition(({ coords })=>{
        //this.loadingPosition = false;
        //this.geolocation = coords;
        instance.geo =  coords;
        console.log(coords)
      });

      //this.notifyMe();

    },
    methods:{


      getPlatformType() {
        if(navigator.userAgent.match(/mobile/i)) {
          console.log('Mobile')
          //return 'Mobile';
          let instance = this;
          this.notification = cordova.plugins.notification.local;
          this.notification.requestPermission(function (granted) {
            // if(granted){
            //   instance.androidNotification();
            // }
          });

        }
        // else if (navigator.userAgent.match(/iPad|Android|Touch/i)) {
        //   //return 'Tablet';
        //   console.log('Tablet')
        // }
        else {
          console.log('Desktop')
          this.notifyMe();
          //return 'Desktop';
        }
      },
      androidNotification(id){
       // this.notification.cancelAll();
        let instance = this;
        this.notification.isScheduled(id, function (scheduled) {
          alert(id + ': '+ scheduled)
          if(!scheduled){
            if(id===1)
            {
              instance.notification.schedule({
                id: 1,
                title: 'Daily Expense',
                // text: 'Chorami koira notification use kortesi ',
                // // actions: [{
                // //   id: 'reply',
                // //   type: 'input',
                // //   title: 'Reply',
                // //   emptyText: 'Type message',
                // // }, ]
                smallIcon: 'res://mipmap-xhdpi/icon.png',
                icon: "res://icon",
              });
            }
            else if(id===2){
              instance.notification.schedule({
                  id: 2,
                  title: "Time to pay your monthly bills",
                  smallIcon: 'res://icon',
                  icon: "res://icon",
                  color:'#ff0000',
                  trigger: {every: { day: 5, hour: 10, minute: 1, second: 0 }},
                  foreground: true
                });
            }
          }

        });

      // let tomorrow10pm = moment().add(1, 'days').hours(20).minutes(0).seconds(0);
       // let date = parseInt(moment().format('M'));


        // this.notification.on("click", function(notification) {
        //   if(notification.id === 1){
        //     // window.location = 'index.html#/DailyExpense';
        //     // alert(notification.id)
        //     instance.$router.push({ path:'/DailyExpense' });
        //     //alert(notification.id)
        //   }
        //   else{
        //     instance.day = instance.notification.launchDetails;
        //     alert(instance.day);
        //   }
        // });
      },
      daily(){
        this.notification.schedule({
          id: 1,
          title: 'Daily Expense',
          smallIcon: 'res://mipmap-xhdpi/icon.png',
          icon: "res://icon",
        });
      },


      notifyMe() {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
          alert("This browser does not support desktop notification");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
          // If it's okay let's create a notification
          var notification = new Notification("Hi there!");
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              var notification = new Notification("Hi there!");
            }
          });
        }

      },
    }
  }
</script>

<style lang="scss">


</style>
