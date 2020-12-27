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
    userId: null,
    password: '',
    userLogged: null,
    idGame: null,
    email: null,
    postTitle: '',
    postMessage: '',
    posts: [],
  },
  methods: {
    register: function () {
      firebase.auth().createUserWithEmailAndPassword(app.name, app.password)
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
      var postsRef = firebase.database().ref(app.idGame);
      var userRef = firebase.database().ref(app.userId);
      var posts = {
        postTitle: app.postTitle,
        postMessage: app.postMessage,
        email: app.userLogged.email,
        authorPic: app.userLogged.photoURL,
        emailVerified: app.userLogged.emailVerified,
      }
      userRef.push(posts)
      postsRef.push(posts)
      .then(function () {
          alert('Your post was sent');
        })
      app.postTitle = '';
      app.postMessage = '';
      app.userId = null;
    },
    showModal: function (modal) {
      $('#navbar').hide();
      if (app.userLogged != null && app.userLogged.emailVerified == true) {
        $('#sidebar, #page-1, #page-2, #page-3, #page-4, #my-posts, #write-post, #Icon, .Email').hide();
        $('#modal, #home-posts, #photo, .userGoogle').show();
      } else if (app.userLogged != null && app.userLogged.emailVerified == false) {
        $('#sidebar, #page-1, #page-2, #page-3, #page-4, #my-posts, #write-post, #photo, .userGoogle').hide();
        $('#modal, #home-posts, #Icon, .Email').show();
      }
    },
    selectGame: function (idGame, userId) {
      app.userId = userId, 
      app.idGame = idGame;
      app.showModal('#modal');
      app.readGame();
    },
    readGame: function () {
      app.posts = [];
      firebase.database().ref(app.idGame).off();
      firebase.database().ref(app.idGame).on('child_added', function (childSnapshot, prevChildKey) {
        console.log(childSnapshot.val());
        app.posts.push(childSnapshot.val());
      });
    },
    readUserPost: function(){
      app.posts = [];
      firebase.database().ref(app.userId).off();
      firebase.database().ref(app.userId).on('child_added', function (childSnapshot, prevChildKey) {
        console.log(childSnapshot.val());
        app.posts.push(childSnapshot.val());
      });
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


/*--------------------------------------------------------------Main page main.html-------------------------------------------------------*/

/*----------Single page --------*/
function showPage(pageId) {
  $(".page").hide();
  $(pageId).show();
}

/*----------On and off icon animation--------*/

$('#on').hide();
function showIcon(icon) {
  $("#off").hide();
  $('#on').show();
}

/*----------Navbar top--------*/
$(".navbar-toggler").click(function () {
  $('.navbar-collapse').toggle('slow');
});

$(".nav-item").click(function () {
  $('.navbar-collapse').hide();
  $('#off').show();
  $('#on').hide();
});

/*-----------------When Home-Posts is clicked--------------*/

function homePosts() {
  $('#write-post, #my-posts').hide('toggle');
  $('#home-posts').show('toggle');
  app.readGame();
}

/*-----------------When My posts is clicked--------------*/

function myPosts() {
  $('#write-post, #home-posts').hide('toggle');
  $('#my-posts').show('toggle');
  app.readUserPost();
}

/*-----------------When write a post is clicked--------------*/

function writePost() {
  $('#home-posts, #my-posts').hide('toggle');
  $('#write-post').show('toggle');
}

/*-------------When popup is closed -------------*/
$(".fa-times-circle").click(function () {
  $('#modal').hide();
  $('#page-0, #sidebar, #page-1, #page-2, #page-3, #page-4').show();
});

/*----------Sign out modal---------------*/
function signOut2() {
  $('#modal-sign-out2').modal('show');
}

$("#yes").click(function () {
  $('#modal-sign-out2').hide();
  firebase.auth().signOut();
});

/*----------Modal Warning---------------*/
function modalWarning() {
  $('#modal-warning').modal('show');
}

/*----------Eliminating button focus---------------*/

$('button').focus(function (event) {
  event.target.blur();
});

