<template>
  <v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <div :class="{'m-2-last': posts.length == index+1}" :key="post.bill+index" class="m-2"
             v-for="(post,index) in posts">
          <div @click="dialog = true, component = 'SingleExpenseDetails',singleExpenseData = post"
               class="card-wrapper" :class="[[post.status? 'paid ' : 'due'],[settingsData.darkMode ? 'theme--dark' : 'theme--light']]">
            <div class="card">
              <div class="card-content">
                <div class="expense-header">
                  <span class="header-content">{{post.title}}</span>
                  <span class="header-content"> {{post.bill}}</span>
                  <span class="header-content">
                  <v-badge :class="[post.status? 'green ' : 'red']" class="text--white rounded status-badge">{{post.status ? 'Paid' : 'Due' }}</v-badge>
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <div class="card-wrapper total-monthly-expense-card" :class="[[settingsData.darkMode ? 'theme--dark' : 'theme--light']]">
      <div class="card">
        <div class="card-content">
          <div class="expense-header">
            <span class="header-content">Total expense</span>
            <span class="header-content"> Total paid</span>
            <span class="header-content">
                  Total due
            </span>
          </div>
        </div>
      </div>
    </div>
    <v-btn @click="dialog = true,component = 'AddorEditMonthlyExpense'" class="todo-fab" color="#515354" dark fab fixed right>
      <v-icon dark>add</v-icon>
    </v-btn>

    <v-bottom-sheet v-model="dialog">
      <v-card class="modal-form" :color="settingsData.darkMode ? '#414345' : '#ffffff'" :dark="settingsData.darkMode">
        <Component :is="component" :posts.sync="posts" :singleExpenseData="singleExpenseData" :component.sync="component" :dialog.sync="dialog" class="pa-3"
                   v-if="dialog"></Component>
      </v-card>
    </v-bottom-sheet>
  </v-layout>


</template>

<script>

  import AddorEditMonthlyExpense from '../views/AddorEditMonthlyExpense';
  import SingleExpenseDetails from '../views/SingleExpenseDetails';

  import Storage from '../services/storage';
  const storage = new Storage();

  export default {
    name: 'MonthlyExpense',
    props:['settingsData'],
    components:{
      AddorEditMonthlyExpense,
      SingleExpenseDetails,
    },
    data() {
      return {
        posts: [],
        singleExpenseData: null,
        dialog: false,
        component: null,
        previousComponent: [],
      }
    },
    created() {
      let instance = this;
      storage.get('monthlyExpenseData').then((value) => {
        if (value != null) {
          let data = JSON.parse(value);
          if (data.length > 0) {
            instance.posts = data;
          } else {
            instance.posts.push(data);
          }
        }
      });
    },
    mounted() {

      var openedModal = [];

      let instance = this;
      document.addEventListener("backbutton", function () {

        if(instance.previousComponent.length>1)
        {
          instance.component = instance.previousComponent[instance.previousComponent.length-2];
          instance.previousComponent.pop();
        } else instance.dialog = false;
      });

      // let elem = document.querySelectorAll('.modal'),
      //   bottomTab = document.querySelector('#btm-hider');

      // M.Modal.init(elem, {
      //     onOpenStart: function () {
      //       bottomTab.setAttribute("style", "display:none;");
      //       let openedModalUnordered = [];
      //       elem.forEach(function (el) {
      //         if (el.M_Modal) {
      //           if (el.M_Modal.isOpen) {
      //             openedModalUnordered.push(el.M_Modal.id);
      //           }
      //         }
      //       });
      //       if (openedModal.length > 0) {
      //         let searched = _.xor(openedModal, openedModalUnordered);
      //         openedModal.push(searched[0]);
      //       } else {
      //         openedModal = openedModalUnordered;
      //       }
      //     },
      //     onCloseStart: function () {
      //       if (openedModal.length <= 1) {
      //         bottomTab.removeAttribute("style");
      //       }
      //       openedModal.pop();
      //     },
      //   }
      // );
    },
    methods: {

    },
    watch: {

      component(newValue){
        if(this.dialog && newValue){
        //  if(typeof (this.previousComponent)!= 'array') this.previousComponent = [];
          if(this.previousComponent.length>=1)
          {
            console.log(!this.previousComponent.filter( e => e== newValue))
           if(this.previousComponent.filter( e => e== newValue).length==0){
             this.previousComponent.push(newValue);
           }
          }
          else{
            this.previousComponent.push(newValue);
          }

          console.log(this.previousComponent)
        }
        //this.previousComponentChecker();
      },
      dialog (val) {

        let instance = this;
        if(!val)
        {
          document.querySelector("body").removeAttribute('style');
          this.singleExpenseData= null;
          this.previousComponent = [];
          this.component = null;

          setTimeout(function () {
            if(instance.settingsData.darkMode) {
              NavigationBar.backgroundColorByHexString('#212121');
            }
            else{
              NavigationBar.backgroundColorByHexString('#ffffff');
            }
          },50);
        }
        else
          {
          document.querySelector("body").setAttribute('style','position: fixed; width: 100%;');

          setTimeout(function () {
            if(instance.settingsData.darkMode) {
              NavigationBar.backgroundColorByHexString('#414345');
            }
            else{
              NavigationBar.backgroundColorByHexString('#ffffff');
            }
          },100);
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .todo-fab {
    bottom: 66px;
  }

  .m-2 {
    margin: 20px 20px;
  }

  .m-2-last {
    margin-bottom: 76px;
  }
  .card-wrapper {
    border-radius: 10px;
    background-repeat: no-repeat;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    transition: box-shadow .25s, -webkit-box-shadow .25s;
    padding: 3px;

    .card {
      border-radius: inherit !important;
      margin: 0 !important;
      box-shadow: none !important;
      .card-content {
        padding: 15px;
      }
    }

    &.paid {
      //background-image: linear-gradient(to left, #ffffff 0%, #79de7d 50%, #FFF);
    }

    &.due {
      //background-image: linear-gradient(to left, #ff416c -10%, #ffffff -5%, #ff4b2b);
    }

    .status-badge {
      border-radius: 10px !important;
    }
  }

  .status-badge {
    font-size: 0.7rem !important;
    line-height: 18px !important;
    height: 17px !important;
    min-width: 30px !important;
    text-align: center;
    color: #ffffff !important;
  }

  .expense-header {
    display: flex;
    justify-content: space-between;

    .header-content {
      flex-grow: 1;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      color: #fff;

      &:nth-child(1) {
        justify-content: flex-start;
      }

      &:nth-child(2) {
        justify-content: center;
      }

      &:nth-child(3) {
        justify-content: flex-end;
      }
    }
  }

  .theme--dark{
    &.card-wrapper {
      .card {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
  .theme--light{
    &.card-wrapper {
      .card {
        background: rgba(0, 0, 0, 0.1);
        .expense-header{
          .header-content{
            color: #212121;;
          }
        }
      }
    }
  }
  .total-monthly-expense-card{
    position: fixed;
    width: calc(100% - 7rem);
    margin: 1rem;
    bottom: 50px;
  }

  /*.v-dialog{*/
  /*margin: 0 !important;*/

  /*}*/
  /*.bottom-modal{*/

  /*}*/

</style>
