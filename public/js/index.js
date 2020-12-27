// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDYpy-1bePf5JPxYJHrKruugH87wgzcWl4",
  authDomain: "nysl-cc182.firebaseapp.com",
  databaseURL: "https://nysl-cc182.firebaseio.com",
  projectId: "nysl-cc182",
  storageBucket: "nysl-cc182.appspot.com",
  messagingSenderId: "998853696629",
  appId: "1:998853696629:web:1d7b43f5ac0757be21ec3c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var app = new Vue({
  el: '#app',
  data: {
    name: '',
    user: '',
    password: '',
    userLogged: null,
    postTitle: '',
    postMessage: '',
  },
  methods: {
    register: function () {
      firebase.auth().createUserWithEmailAndPassword(app.user, app.password)
        .then(function () {
          alert("User Successfully Registered");
        })
        .catch(function (error) {
          // Handle Errors here.
          alert(error.message);
        });
    },
    login: function () {
      firebase.auth().signInWithEmailAndPassword(app.user, app.password)
        .then(function () {
          alert('User successfully logged');
        })
        .catch(function (error) {
          // Handle Errors here.
          alert(error.message);
        });
    },
    google: function () {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .catch(function (error) {
          alert(error.message);
        });
    },
    post: function () {
      var postsRef = firebase.database().ref(posts);
      var posts = {
        postTitle: app.postTitle,
        postMessage: app.postMessage,
      }
      postsRef.push(posts);
    }
  }
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    app.userLogged = user;
  } else {
    app.userLogged = null;
  }
});

/*-----------------------------------------------------------------index.html-------------------------------------------------------------------*/

/*----------First step to login---------------*/

$('.btn-open-popup').click(function () {
  $('#modal1').show();
});

/*----------If Sign-in with email is the option clicked---------------*/

$(".sign-in-email, .login").hide();
$(".popUp-text3, .popUp-text4").show();

$(".popUp-text3").click(function () {

  $('.popUp-text2, .popUp-text3, .popUp-text4, .popUp-text5').hide('slow');
  $(".sign-in-email").toggle('slow');
});

/*-------------------If Login is the option clicked----------------------*/
$(".popUp-text4").click(function () {

  $('.popUp-text2, .popUp-text3, .popUp-text4, .popUp-text5').hide('slow');
  $(".login").toggle('slow');

});

/*-------------------User already logged (modal)----------------------*/
function showModal2() {

  $('.popUp-text7').hide();
  $('#yes').hide();
  $('#no').hide();

  if (app.userLogged != null && app.userLogged.emailVerified == true) {
    $('#userIcon1, .userEmail').hide();
    $('#modal1, #userPhoto1, .userGoogle').show();
  } else if (app.userLogged != null && app.userLogged.emailVerified == false) {
    $('#userPhoto1, .userGoogle').hide();
    $('#modal1, #userIcon1, .userEmail').show();
  }

  $('#modal-sign-out').click(function () {
    $('.popUp-text2, .popUp-text6').hide('toggle');
    $('.popUp-text7, #yes, #no').show('toggle');

    $("#yes").click(function () {
      firebase.auth().signOut();
    });

    $("#no").click(function () {
      $('.popUp-text7, #yes, #no').hide('toggle');
      $('.popUp-text2, .popUp-text6').show('toggle');
    });

  })

}

/*----------Go back button---------------*/

$(".go-back-button").click(function () {
  $('.popUp-text2, .popUp-text3, .popUp-text4, .popUp-text5').show('slow');
  $('.sign-in-email, .login').hide('slow');
});


/*----------User succesfully logged icon or photo---------------*/
function userPhoto() {
  $('#userIcon').hide();
  if (app.userLogged != null && app.userLogged.emailVerified == true) {
    $('#userIcon').hide();
    $('#userPhoto').show();

  } else if (app.userLogged != null && app.userLogged.emailVerified == false) {
    $('#userPhoto').hide();
    $('#userIcon').show();
  }
}

/*----------Close modal---------------*/

$("#close").click(function () {
  $('#modal1').hide();
  $('.popUp-text2, .popUp-text6').show('toggle');
});

/*----------Eliminating button focus---------------*/

$('button').focus(function (event) {
  event.target.blur();
});

