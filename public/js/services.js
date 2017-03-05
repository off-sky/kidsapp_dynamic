'use strict'
angular.module('kiddsapp.services', [])
.constant('my_config', {
    baseUrl: 'https://kids-school.herokuapp.com/',
    modalOpen: false
})
.factory('newsFactory', ['$resource', 'my_config', 'userFactory', function($resource, my_config, userFactory){
    var News = $resource(my_config.baseUrl+'news/:newsId', null, {
        getNews: {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:8080'
            },
            isArray: true
        },
        postNews: {
            method: 'POST',
            headers: {
                'Origin': 'http://localhost:8080',
                'x-access-token' : userFactory.getCurrentToken()
            }
        },
        deleteNews: {
           method: 'DELETE',
            headers: {
                'Origin': 'http://localhost:8080',
                'x-access-token' : userFactory.getCurrentToken()
            } 
        },
        updateNews: {
            method: 'PUT',
            headers: {
                'Origin': 'http://localhost:8080',
                'x-access-token' : userFactory.getCurrentToken()
            }
        },
        getOneNews: {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:8080'
            },
            isArray: false
        },
        update: {
            method: 'PUT'
        }
    });
    
    var news = [];
    News.getNews(function(res){
        for(var i = 0; i < res.length; i++)
            news.push(res[i])
            console.log('Res length: '+res.length);
            console.log('News length after: '+news.length);
    }, function(res){
        
    });
    console.log('News length: '+news.length);
    return {
        newsResource: News,
        news : news,
        getNewsById: function(newsId){
            for (var i = 0; i < news.length; i++){
                if (news[i].id == newsId) return news[i];
            }
        },
        deleteNews: function(id) {
            for (var i = 0; i < news.length; i++){
                if (news[i].id == id) news.splice(i, 1);
            }
        },
        addNews: function(newsToAdd){
            var id = news.length > 0 ? news[0].id+1 : 0;
            newsToAdd.id = id;
            news.unshift(newsToAdd);
        },
        changeNews: function(id, newNews) {
            for (var i = 0; i < news.length; i++){
                if (news[i].id == id) {news.splice(i, 1, newNews); return}
            }
        },
        logNews : function(){
            console.log(news);
        }
    }
}])

.factory('teachersFactory', ['$resource', 'my_config', 'userFactory', function($resource, my_config, userFactory){
    
    
    var Teachers = $resource(my_config.baseUrl+'teachers/:teacherId', null, {
        getTeachers: {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:8080'
            },
            isArray: true
        },
        postTeacher: {
            method: 'POST',
            headers: {
                'Origin': 'http://localhost:8080',
                'x-access-token' : userFactory.getCurrentToken()
            }
        },
        deleteTeacher: {
            method: 'DELETE',
            headers: {
                'Origin': 'http://localhost:8080',
                'x-access-token' : userFactory.getCurrentToken()
            }
        },
        updateTeacher: {
            method: 'PUT',
            headers: {
                'Origin': 'http://localhost:8080',
                'x-access-token' : userFactory.getCurrentToken()
            }
        },
        getOneTeacher: {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:8080'
            },
            isArray: false
        }
        
    });
    var teachers = [
        {
      "id": 0,
      "firstName": "Катерина Володимирівна",
      "lastName": "ІВАСЕНКО",
      "position": 'Викладач англійської та німецької мов',
      "photo": "assets/photo_Kate.jpg",
      "description": "Викладач англійської і німецької мов у мовній школі KIDS. З відзнакою закінчила Вінницький державний педагогічний університет ім. Михайла Коцюбинського, інститут іноземних мов за спеціальністю англійська мова, німецька мова і зарубіжна література. Має сертифікат BRITISH COUNCIL за проходження курсу Professional Practices for English Language Teaching (Професійні методики викладання англійської мови) у 2016 році. Також у жовтні 2010 року пройшла сертифікацію на знання німецької мови на рівні B2 у Центрі тестування німецької мови як іноземної.  Прихильниця збалансованого підходу, де всі аспекти мови отримують достатньо уваги: говоріння, читання, слухання і письмо."
    },
    {
      "id": 1,
      "firstName": "Дмитро Юрійович",
      "lastName": "БІЛОУС",
      "position": 'Викладач англійської мови, організатор подій',
      "photo": "assets/photo_Dima.jpg",
      "description": "Викладає англійську мову у KIDS.  Випускник Вінницького державного педагогічного університету ім. Михайла Коцюбинського. Має сертифікат BRITISH COUNCIL за проходження курсу Professional \nPractices for English Language Teaching (Професійні методики викладання \nанглійської мови) у 2016 році. Чудово організовує навчальний процес: на уроці просто неможливо занудьгувати, а мова вчиться \"наче саме\" (як сказав один учень)."
    },
    {
      "id": 2,
      "firstName": "Інна Ігорівна",
      "lastName": "БРОДСЬКА",
      "position": 'Викладач англійської мови',
      "photo": "assets/photo_Inna.jpg",
      "description": "Викладає англійську мову у KIDS. Випускниця Тернопільського національного економічного університету ім. Гнатюка. Має досвід роботи у США і викладання у Хмельницькій національній прикордонній академії. Чудовий комунікатор, вона одразу робить акцент на спілкуванні англійською, що стрімко покращує якість усного мовлення в учнів."
    }
    ]
    return {
        teachersResource: Teachers,
        teachers: teachers,
        replaceTeachers: function(newTeachers) {
            var l = teachers.length;
            for (var i = 0; i <= l; i++) {
                teachers.pop();
            }
            for (var i = 0; i < newTeachers.length; i++) {
                teachers.push(newTeachers[i]);
            }
        },
        getTeacherById: function(teacherId){
            for (var i = 0; i < teachers.length; i++) {
                if (teachers[i].id == teacherId) {
                    return teachers[i];
                }
            }
        },
        deleteTeacher: function(teacherId){
            for (var i = 0; i < teachers.length; i++) {
                if (teachers[i].id == teacherId) {
                    teachers.splice(i, 1);
                }
            }
        }
    }
}])
.factory('galleryFactory', ['my_config', '$resource', 'userFactory', function(my_config, $resource, userFactory){
    var Gallery = $resource(my_config.baseUrl+'events/:eventId/:photoId', null, {
        getEvents: {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:8080'
            },
            isArray: true
        },
        postEvent: {
            method: 'POST',
            headers: {
                'Origin': 'http://localhost:8080',
                'x-access-token' : userFactory.getCurrentToken()
            }
        },
        deleteEvent: {
            method: 'DELETE',
            headers: {
                'Origin': 'http://localhost:8080',
                'x-access-token' : userFactory.getCurrentToken()
            }
        },
        updateEvent: {
            method: 'PUT',
            headers: {
                'Origin': 'http://localhost:8080',
                'x-access-token' : userFactory.getCurrentToken()
            }
        },
        getOneEvent: {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:8080'
            },
            isArray: false
        }    
    })
//    var gallery = [
//        {
//            id: 3,
//            name: 'Halloween',
//            date: '30.10.2014',
//            photos: [
//                {
//                    id: 0,
//                    ref: 'assets/photo1.png'
//                },
//                {
//                    id: 1,
//                    ref: 'assets/photo2.png'
//                },
//                {
//                    id: 2,
//                    ref: 'assets/photo3.png'
//                },
//                {
//                    id: 3,
//                    ref: 'assets/photo1.png'
//                }
//            ]
//        },
//        {
//            id: 2,
//            name: 'New Year',
//            date: '01.01.2015',
//            photos: [
//                {
//                    id: 0,
//                    ref: 'assets/photo1.png'
//                },
//                {
//                    id: 1,
//                    ref: 'assets/photo2.png'
//                },
//                {
//                    id: 2,
//                    ref: 'assets/photo3.png'
//                },
//                {
//                    id: 3,
//                    ref: 'assets/photo1.png'
//                },
//                {
//                    id: 4,
//                    ref: 'assets/photo4.png'
//                },
//                {
//                    id: 5,
//                    ref: 'assets/photo5.png'
//                },
//                {
//                    id: 6,
//                    ref: 'assets/photo6.png'
//                },
//                {
//                    id: 7,
//                    ref: 'assets/photo7.png'
//                },
//                {
//                    id: 8,
//                    ref: 'assets/photo1.png'
//                },
//                {
//                    id: 9,
//                    ref: 'assets/photo2.png'
//                },
//                {
//                    id: 10,
//                    ref: 'assets/photo5.png'
//                }
//            ]
//        },
//        {
//            id: 1,
//            name: 'Speaking Club with John Woo',
//            date: '02.03.2015',
//            photos: [
//                {
//                    id: 0,
//                    ref: 'assets/photo1.png'
//                },
//                {
//                    id: 1,
//                    ref: 'assets/photo2.png'
//                },
//                {
//                    id: 2,
//                    ref: 'assets/photo3.png'
//                },
//                {
//                    id: 3,
//                    ref: 'assets/photo1.png'
//                }
//            ]
//        },
//        {
//            id: 0,
//            name: 'Movie session',
//            date: '04.04.2015',
//            photos: [
//                {
//                    id: 0,
//                    ref: 'assets/photo1.png'
//                },
//                {
//                    id: 1,
//                    ref: 'assets/photo2.png'
//                },
//                {
//                    id: 2,
//                    ref: 'assets/photo3.png'
//                },
//                {
//                    id: 3,
//                    ref: 'assets/photo1.png'
//                }
//            ]
//        }
//    ]  
    return {
        galleryResource: Gallery,
        getGallery: function(){
            return gallery;
        },
        addEvent: function(event) {
            var id = gallery[gallery.length - 1].id+1;
            event.id = id;
            gallery.unshift(event);
        },
        removeEvent: function(eventId){
            for(var i = 0; i < gallery.length; i++){
                if (gallery[i].id == eventId) {
                    gallery.splice(i, 1);
                    return true;
                }
            }
            return false;
        },
        addPhotoToEvent: function(eventId, photo){
            for(var i = 0; i < gallery.length; i++){
                if (gallery[i].id == eventId) {
                    var event = gallery[i];
                    var id = event.photos[event.photos.length-1].id+1;
                    photo.id = id;
                    event.photos.push(photo);
                    return true;
                }
            }
            return false;
        },
        removePhotoFromEvent: function(eventId, photoId) {
            for(var i = 0; i < gallery.length; i++){
                if (gallery[i].id == eventId) {
                    var event = gallery[i];
                    for (var g = 0; g < event.photos.length; g++) {
                        if (event.photos[g] == photoId) {
                            event.photos.splice(g, 1);
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        getEventById: function(eventId){
            for(var i = 0; i < gallery.length; i++){
                if (gallery[i].id == eventId) {
                    return gallery[i];
                }
            }
            return {};
        },
        getPhotoInfo: function(eventId, photoId){
            for(var i = 0; i < gallery.length; i++){
                if (gallery[i].id == eventId) {
                    var event = gallery[i];
                    for (var j = 0; j < event.photos.length; j++) {
                        if (event.photos[j].id == photoId)
                            return {
                            currentPhoto: event.photos[j],
                            currentEvent: event,
                            photoIndex: j,
                            eventIndex: i  
                        }
                        
                    }
                }
            }
            return false;
        }
    }
}])
.factory('userFactory', ['$window', '$localStorage', '$cookies', '$resource', 'my_config', function($window, $localStorage, $cookies, $resource, my_config){
    var userResource = {}
    userResource.login = $resource(my_config.baseUrl+"users/login", null, {
        loginUser: {
            method: 'POST',
            headers: {
                'Origin': 'http://localhost:8080'
            }
        }
    });
    userResource.register = $resource(my_config.baseUrl+"users/register", null, {
        registerUser: {
            method: 'POST',
            headers: {
                'Origin': 'http://localhost:8080'
            }
        }
    });
    var currentUser = {};
    var adminCode = 'KIDS';
    var isLogged = false;
    var users = [
        {
            id: 0,
            username: 'Roman',
            email: 'petrodzher@gmail.com',
            password: 'roma',
            admin: true
        },
        {
            id: 1,
            username: 'Kate',
            email: 'kate_ivasenko5@i.ua',
            password: 'kate',
            admin: true
        },
        {
            id: 2,
            username: 'John',
            email: '',
            password: 'john',
            admin: false
        }
        
    ];
    
    
    
    
    
    
    return {
        //Server-side user implementation
        userResource: userResource,
        parseJwt : function(token) {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          return JSON.parse($window.atob(base64));
        },
        saveToken : function(token){
           $cookies.put("token", token) 
        },
        getToken : function(){
            return $cookies.get("token");
        },
        isAuthed : function(){
            var token = this.getToken();
            if(token) {
                var params = this.parseJwt(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp;
              } else {
                return false;
              }
        },
        logout : function() {
          $cookies.remove("token");
          this.updateCurrentUser();
        },
        getCurrentToken : function(){
            if(!this.isAuthed()) return ''
            console.log('Retrieved token: '+this.getToken())
            return this.getToken();
        },
        //End of server side implemetation. TODO revise code below
        addUser: function(newUser) {
            var id = users.length > 0 ? users[users.length-1].id+1 : 0;
            newUser.id = id;
            users.push(newUser);  
        },
        userNameExists: function(username){
            for(var i = 0; i<users.length; i++) {
                if (username == users[i].username) return true;
            }
            return false;
        },
        emailExists: function(email){
            for(var i = 0; i<users.length; i++) {
                if (email == users[i].email) return true;
            }
            return false;
        },
        checkAdminCode: function(code){
            if (code == adminCode) return true
            else return false;
        },
        getUserById: function(userId) {
            for(var i = 0; i<users.length; i++) {
                if (userId == users[i].id) return users[i];
            }
            return false;
        },
        loginUser: function(user){
            var input = user.input;
            var password = user.password;
            if(input.indexOf('@') > 0) {
                for(var i = 0; i < users.length; i++){
                    if (input == users[i].email) {
                        if (password == users[i].password) {
                            isLogged = true;
                            currentUser.username = users[i].username;
                            currentUser.email = users[i].email;
                            currentUser.admin = users[i].admin;
                            $localStorage.storeObject('currentUser', currentUser);
                            return {status: 'Успішно', loggedIn: true}
                        } else {
                            return {status: 'Неправильний пароль!', loggedIn: false}
                        }
                    }
                }
                return {status: 'Користувач із такою поштою не існує', loggedIn: false}
            } else {
                for(var i = 0; i < users.length; i++){
                    if (input == users[i].username) {
                        if (password == users[i].password) {
                            isLogged = true;
                            currentUser.username = users[i].username;
                            currentUser.email = users[i].email;
                            currentUser.admin = users[i].admin;
                            $localStorage.storeObject('currentUser', currentUser);
                            return {status: 'Успішно', loggedIn: true}
                        } else {
                            return {status: 'Неправильний пароль!', loggedIn: false}
                        }
                    }
                }
                return {status: 'Користувач із таким іменем не існує', loggedIn: false}
            }
        },
        updateCurrentUser: function(){
            var token = $cookies.get("token");
            if (!this.isAuthed()) {
                currentUser.username = '',
                currentUser.email = '',
                currentUser.admin = false;
                return;
            }
            var storedUser = this.parseJwt(token)._doc;
            if (storedUser.username != '') {
                isLogged = true;
                currentUser.username = storedUser.username;
                currentUser.email = storedUser.email;
                currentUser.admin = storedUser.admin;
                currentUser.group = storedUser.group;
                currentUser.firstname = storedUser.firstname;
                currentUser.lastname = storedUser.lastname;
            }
            
        },
        currentUser: currentUser,
        logoutUser: function(){
            isLogged = false;
            currentUser.username = '',
                currentUser.email = '',
                currentUser.admin = false;
            $localStorage.replaceObject('currentUser', currentUser);
        },
        printCurrentUser: function(){
            console.log('Current user:');
            console.log(currentUser);
        },
        isLogged: isLogged,
        printAllUsers: function() {
            for(var i = 0; i < users.length; i++){
                console.log(users[i]);
            }
        }
    }
    
}])

.factory('$localStorage', ['$window', function($window){
            return {
                store: function(key, value){
                    $window.localStorage[key] = value;
                },
                
                get: function(key, defaultValue){
                    return $window.localStorage[key] || defaultValue;
                },
                
                storeObject: function(key, value) {
                    $window.localStorage[key] = JSON.stringify(value);
                },
                
                getObject: function(key, defaultValue){
                    return JSON.parse($window.localStorage[key] || defaultValue);
                },
                
                replaceObject: function (key, newObject){
                    $window.localStorage.setItem(key, JSON.stringify(newObject));
                }
                
            }
        }])
.factory('passTestFactory', ['my_config', '$resource', 'userFactory', function(my_config, $resource, userFactory){
    var testResultResource = $resource(my_config.baseUrl+"test-results/:trId", null, {
        getAllResults: {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:8080',
                'x-access-token' : userFactory.getCurrentToken()
            }   
        },
        getOneResult: {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:8080',
            }   
        },
        postResult: {
            method: 'POST',
            headers: {
                'Origin': 'http://localhost:8080',
            } 
        }
    });
    var englishPlacementTest = {
            name: 'Визначення рівня англійської мови - комплексний тест',
            alias: 'placement_English',
            description: 'Більшість питань може мати кілька правильних варіантів відповідей. Складність питань змінюється залежно від Ваших відповідей. Тест автоматично покаже Ваш результат, коли Ви дасте достатню кількість відповідей для оцінки. Ви можете у будь-яку мить призупинити тест і подивитись свій результат на даний момент, а потім повернутись до тесту. Радимо пройти тест до кінця, щоб отримати більш докладний результат. Успіху!',
            levels: [
                        { //first level
                        grammar: [
                    [
                        {
                        id: 0,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: '_______ books look familiar to me.',
                        q: [
                            {id: 0, statement: 'That', add: false},
                            {id: 1, statement: 'So', add: false},
                            {id: 2, statement: 'Those', add: false},
                            {id: 3, statement: 'Although', add: false},
                            {id: 4, statement: 'These', add: false}
                        ],
                        c: [2, 4],
                        ref: [
                            'https://learnenglish.britishcouncil.org/en/english-grammar/pronouns/that-these-and-those'
                        ]
                    },
                    {
                        id: 1,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'Could you pass me _______ cups. I can\'t reach them.',
                        q: [
                            {id: 0, statement: 'those', add: false},
                            {id: 1, statement: 'over', add: false},
                            {id: 2, statement: 'much', add: false},
                            {id: 3, statement: 'these', add: false},
                            {id: 4, statement: 'please', add: false}
                           ],
                        c: [0, 3],
                        ref: [
                            'https://learnenglish.britishcouncil.org/en/english-grammar/pronouns/that-these-and-those'
                        ]
                    },
                    {
                        id: 2,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: '_______ buildings over there belong to Lord McCartney.',
                        q: [
                            {id: 0, statement: 'The', add: false},
                            {id: 1, statement: 'Tall', add: false},
                            {id: 2, statement: 'Those', add: false},
                            {id: 3, statement: 'Any', add: false},
                            {id: 4, statement: 'These', add: false}
                        ],
                        c: [0, 2 ],
                        ref: [
                            'https://learnenglish.britishcouncil.org/en/english-grammar/pronouns/that-these-and-those',
                            'https://learnenglish.britishcouncil.org/en/english-grammar/determiners-and-quantifiers/definite-article'
                        ]
                    }
                ],
                [
                    {
                        id: 3,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'We went shopping and _______ we went to the cinema and saw a film.',
                        q: [
                           {id: 0, statement: 'after', add: false},
                            {id: 1, statement: 'then', add: false},
                            {id: 2, statement: 'soon', add: false},
                            {id: 3, statement: 'lately', add: false},
                            {id: 4, statement: 'late', add: false}
                        ],
                        c: [1],
                        ref: ['https://www.businessenglish.com/grammar/sequence-adverbs.html?lang=eng']
                    },
                    {
                        id: 4,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'When you cook tomatoes, you should wash them _______.',
                        q: [
                            {id: 0, statement: 'up', add: false},
                            {id: 1, statement: 'off', add: false},
                            {id: 2, statement: 'often', add: false},
                            {id: 3, statement: 'not', add: false},
                            {id: 4, statement: 'first', add: false}

                        ],
                        c: [4],
                        ref: ['https://www.businessenglish.com/grammar/sequence-adverbs.html?lang=eng']
                    },
                    {
                        id: 5,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'He _______ helps me about the house.',
                        q: [
                            {id: 0, statement: 'often', add: false},
                            {id: 1, statement: 'lately', add: false},
                            {id: 2, statement: 'always', add: false},
                            {id: 3, statement: 'never', add: false},
                            {id: 4, statement: 'occasionally', add: false}
                        ],
                        c: [
                            0, 2, 3, 4
                           ],
                        ref: ['http://learnenglishteens.britishcouncil.org/grammar-vocabulary/grammar-videos/adverbs-frequency']
                    }
                ],
                [
                    {
                        id: 6,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'My sister is much _______ than me.',
                        q: [
                            {id: 0, statement: 'high', add: false},
                            {id: 1, statement: 'taller', add: false},
                            {id: 2, statement: 'smartest', add: false},
                            {id: 3, statement: 'smarter', add: false},
                            {id: 4, statement: 'more tall', add: false}
                        ],
                        c: [
                            1, 3
                        ],
                        ref: [
                            'http://esl.fis.edu/grammar/rules/comp.htm'
                        ]
                    },
                    {
                        id: 7,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'I think that Uma Thurman is _______ than Jennifer Lopez.',
                        q: [
                            {id: 0, statement: 'beautifuler', add: false},
                            {id: 1, statement: 'prettier', add: false},
                            {id: 2, statement: 'beautifully', add: false},
                            {id: 3, statement: 'more beautiful', add: false},
                            {id: 4, statement: 'pretty', add: false}
                        ],
                        c: [
                           1, 3
                        ],
                        ref: [
                            'http://esl.fis.edu/grammar/rules/comp.htm'
                        ]
                    },
                    {
                        id: 8,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'Mount Everest is _______ mountain in the world.',
                        q: [
                            {id: 0, statement: 'taller', add: false},
                            {id: 1, statement: 'higher', add: false},
                            {id: 2, statement: 'high', add: false},
                            {id: 3, statement: 'highest', add: false},
                            {id: 4, statement: 'the highest', add: false}
                        ],
                        c: [
                            4
                        ],
                        ref: [
                           'http://esl.fis.edu/grammar/rules/comp.htm' 
                        ]
                    },
                    {
                        id: 9,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'The weather in Africa is _______ than the weather in Europe.',
                        q: [
                            {id: 0, statement: 'warmer', add: false},
                            {id: 1, statement: 'the warmer', add: false},
                            {id: 2, statement: 'warmest', add: false},
                            {id: 3, statement: 'hoter', add: false},
                            {id: 4, statement: 'hotter', add: false}
                        ],
                        c: [
                            0, 4
                        ],
                        ref: [
                            'http://esl.fis.edu/grammar/rules/comp.htm' 
                        ]
                    },
                    {
                        id: 10,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'This is _______ issue.',
                        q: [
                            {id: 0, statement: 'importantest', add: false},
                            {id: 1, statement: 'importanter', add: false},
                            {id: 2, statement: 'the most important', add: false},
                            {id: 3, statement: 'most important', add: false},
                            {id: 4, statement: 'an important', add: false}
                        ],
                        c: [
                            2, 4
                        ],
                        ref: [
                            'http://esl.fis.edu/grammar/rules/comp.htm'
                        ]
                    }


                ],
                [
                   {
                       id: 11,
                       type: 'multipleChoiceGrammar',
                       target: 'Grammar',
                       task: 'Choose correct options to insert in the sentence.',
                       sentence: '_______ she going to get married?',
                       q: [
                           {id: 0, statement: 'Will', add: false},
                            {id: 1, statement: 'Does', add: false},
                            {id: 2, statement: 'Do', add: false},
                            {id: 3, statement: 'Is', add: false},
                            {id: 4, statement: 'Am', add: false}
                       ],
                       c: [
                           3
                       ],
                       ref: [
                           'http://dictionary.cambridge.org/grammar/british-grammar/future/future-be-going-to-i-am-going-to-work'
                       ]
                   },
                    {
                        id: 12,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'I am going _______ a job next month.',
                        q: [
                            {id: 0, statement: 'to look for', add: false},
                            {id: 1, statement: 'looking for', add: false},
                            {id: 2, statement: 'look for', add: false},
                            {id: 3, statement: 'will look for', add: false},
                            {id: 4, statement: 'not look for', add: false}
                        ],
                        c: [
                            0
                        ]
                    },
                    {
                        id: 13,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'He _______ going to talk to me about it.',
                        q: [
                            {id: 0, statement: 'doesn\'t', add: false},
                            {id: 1, statement: 'will', add: false},
                            {id: 2, statement: 'is', add: false},
                            {id: 3, statement: 'isn\'t', add: false},
                            {id: 4, statement: 'shouldn\'t', add: false}
                        ],
                        c: [
                             2, 3
                        ]
                    }
                ],
                [
                    {
                        id: 14,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'How _______ apples are there in your bag?',
                        q: [
                           {id: 0, statement: 'much', add: false},
                            {id: 1, statement: 'no', add: false},
                            {id: 2, statement: 'often', add: false},
                            {id: 3, statement: 'anything', add: false},
                            {id: 4, statement: 'many', add: false}
                        ],
                        c: [
                            4
                        ],
                        ref: [
                            'http://www.grammar.cl/english/how-much-how-many.htm'
                        ]
                    },
                    {
                        id: 15,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'I know _______ people.',
                        q: [
                            {id: 0, statement: 'much', add: false},
                            {id: 1, statement: 'nothing', add: false},
                            {id: 2, statement: 'anything', add: false},
                            {id: 3, statement: 'many', add: false},
                            {id: 4, statement: 'at least', add: false}
                        ],
                        c: [
                            3
                        ],
                        ref: [
                            'http://dictionary.cambridge.org/grammar/british-grammar/quantifiers/much-many-a-lot-of-lots-of-quantifiers'
                        ]
                    },
                    {
                        id: 16,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'I don\'t eat _______ fish.',
                        q: [
                            {id: 0, statement: 'many', add: false},
                            {id: 1, statement: 'much', add: false},
                            {id: 2, statement: 'no', add: false},
                            {id: 3, statement: 'nothing', add: false}
                        ],
                        c: [
                            1
                        ],
                        ref: [
                            'http://www.grammar-quizzes.com/agr_muchmany.html'
                        ]
                    },
                    {
                        id: 17,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'The fruit _______ delicious.',
                        q: [
                           {id: 0, statement: 'will', add: false},
                            {id: 1, statement: 'is', add: false},
                            {id: 2, statement: 'are', add: false},
                            {id: 3, statement: 'very', add: false},
                            {id: 4, statement: 'should', add: false}
                        ],
                        c: [
                            1
                        ],
                        ref: [
                            'http://www.ef.com/english-resources/english-grammar/countable-and-uncountable-nouns/'
                        ]
                    }  
                ],
                [
                    {
                        id: 18,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'I\'d like _______ longer, but I need to go.',
                        q: [
                           {id: 0, statement: 'stay', add: false},
                            {id: 1, statement: 'staying', add: false},
                            {id: 2, statement: 'to stay', add: false},
                            {id: 3, statement: 'will stay', add: false}
                        ],
                        c: [
                            2
                        ]
                    },
                    {
                        id: 19,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'I\'d really like _______ to the cinema with you, but I have much work.',
                        q: [
                           {id: 0, statement: 'to go', add: false},
                            {id: 1, statement: 'going', add: false},
                            {id: 2, statement: 'go', add: false},
                            {id: 3, statement: 'will go', add: false},
                            {id: 4, statement: 'went', add: false}
                        ],
                        c: [
                            0
                        ]

                    }
                ],
                [
                    {
                        id: 20,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'He can _______ football very well.',
                        q: [
                            {id: 0, statement: 'played', add: false},
                            {id: 1, statement: 'playing', add: false},
                            {id: 2, statement: 'play', add: false},
                            {id: 3, statement: 'to play', add: false},
                            {id: 4, statement: 'will play', add: false}
                        ],
                        c: [
                            2
                        ],
                        ref: [
                            'http://www.perfect-english-grammar.com/modal-verbs.html'
                        ]
                    },
                    {
                        id: 21,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'I\'m sorry, but I _______ go.',
                        q: [
                            {id: 0, statement: 'needing', add: false},
                            {id: 1, statement: 'must to', add: false},
                            {id: 2, statement: 'need to', add: false},
                            {id: 3, statement: 'let\'s', add: false},
                            {id: 4, statement: 'must', add: false}
                        ],
                        c: [
                            2, 4
                        ],
                        ref: [
                            'http://esl.fis.edu/grammar/rules/modal.htm'
                        ]
                    },
                    {
                        id: 22,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'Should I _______ to my mom\'s advice?',
                        q: [
                            {id: 0, statement: 'to listen', add: false},
                            {id: 1, statement: 'listen', add: false},
                            {id: 2, statement: 'listening', add: false},
                            {id: 3, statement: 'will listen', add: false},
                            {id: 4, statement: 'listened', add: false}
                        ],
                        c: [
                            1
                        ],
                        ref: [
                            'http://esl.fis.edu/grammar/rules/modal.htm'
                        ]
                    }
                ],
                [
                    {
                        id: 23,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'I know you! You _______ at Jim\'s party yesterday!',
                        q: [
                            {id: 0, statement: 'were', add: false},
                            {id: 1, statement: 'was', add: false},
                            {id: 2, statement: 'been', add: false},
                            {id: 3, statement: 'did', add: false},
                            {id: 4, statement: 'are', add: false}
                        ],
                        c: [
                            0
                        ],
                        ref: [
                            'http://www.perfect-english-grammar.com/past-simple.html'
                        ]
                    },
                    {
                        id: 24,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'Are you sure that those shoes _______ in that shop last week?',
                        q: [
                            {id: 0, statement: 'are', add: false},
                            {id: 1, statement: 'to be', add: false},
                            {id: 2, statement: 'were', add: false},
                            {id: 3, statement: 'was', add: false},
                            {id: 4, statement: 'be', add: false}
                        ],
                        c: [
                            2
                        ],
                        ref: [
                            'http://www.perfect-english-grammar.com/past-simple.html'
                        ]
                    },
                    {
                        id: 25,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'I didn\'t see him, because I _______ at school yesterday.',
                        q: [
                            {id: 0, statement: 'didn\'t be', add: false},
                            {id: 1, statement: 'were not been', add: false},
                            {id: 2, statement: 'weren\'t', add: false},
                            {id: 3, statement: 'wasn\'t', add: false},
                            {id: 4, statement: 'was not', add: false}
                        ],
                        c: [
                            3, 4
                        ],
                        ref: [
                            'http://www.perfect-english-grammar.com/past-simple.html'
                        ]
                    }
                ],
                [
                    {
                        id: 26,
                        type: 'multipleChoiceGrammar',
                        target: 'Grammar',
                        task: 'Choose correct options to insert in the sentence.',
                        sentence: 'I didn\'t _______ any sports last year.',
                        q: [
                            {id: 0, statement: 'doing', add: false},
                            {id: 1, statement: 'did', add: false},
                            {id: 2, statement: 'do', add: false},
                            {id: 3, statement: 'have', add: false},
                            {id: 4, statement: 'was', add: false}
                        ],
                        c: [
                            2
                        ],
                        ref: [
                            'http://www.englishpage.com/verbpage/simplepast.html'
                        ]
                    }
                ]
            ],

                            grammar_Topics : [
                {
                    id: 0,
                    name: 'Common and demonstrative adjectives'   
                },
                {
                    id: 1,
                    name: 'Adverbs of frequency'
                },
                {
                    id: 2,
                    name: 'Comparatives and superlatives'
                },
                {
                    id: 3,
                    name: 'Going to'
                },
                {
                    id: 4,
                    name: 'How much/How many'
                },
                {
                    id: 5,
                    name: 'Would like...'
                },
                {
                    id: 6,
                    name: 'Modals'
                },
                {
                    id: 7,
                    name: 'Past Simple of to be'
                },
                {
                    id: 8,
                    name: 'Past Simple'
                }

            ],
                            matchQuestions: [
                {
                    id: 0,
                    type: 'match',
                    target: 'Lexis',
                    task: 'Match words in left column with their antonyms in the right column',
                    left: [
                        {id: 0, word: 'pretty', add: false},
                        {id: 1, word: 'tall', add: false},
                        {id: 2, word: 'kind', add: false},
                        {id: 3, word: 'smooth', add: false},
                        {id: 4, word: 'good', add: false}
                    ],
                    right: [
                        {id: 0, word: 'evil', add: false},
                        {id: 1, word: 'rough', add: false},
                        {id: 2, word: 'bad', add: false},
                        {id: 3, word: 'ugly', add: false},
                        {id: 4, word: 'short', add: false}
                    ],
                    c: [
                        [
                           4,
                            0,
                            2,
                            1,
                            3
                        ],
                        [
                           2,
                            3,
                            0,
                            4,
                            1
                        ]
                    ],
                    userInput: [
                        [],
                        []
                    ],
                    result: 0
                },
                {
                    id: 1,
                    type: 'match',
                    target: 'Lexis',
                    task: 'Match words in left column with their antonyms in the right column',
                    left: [
                        {id: 0, word: 'cold', add: false},
                        {id: 1, word: 'high', add: false},
                        {id: 2, word: 'wide', add: false},
                        {id: 3, word: 'close', add: false},
                        {id: 4, word: 'strong', add: false}
                    ],
                    right: [
                        {id: 0, word: 'narrow', add: false},
                        {id: 1, word: 'warm', add: false},
                        {id: 2, word: 'weak', add: false},
                        {id: 3, word: 'far', add: false},
                        {id: 4, word: 'low', add: false}
                    ],
                    c: [
                        [
                           0,
                            1,
                            2,
                            3,
                            4
                        ],
                        [
                           1,
                            4,
                            0,
                            3,
                            2
                        ]
                    ],
                    userInput: [
                        [],
                        []
                    ],
                    result: 0
                }
            ],
            
                            textTrueOrFalseQuestions: [
                {
                    id: 1,
                    type: 'textTrueOrFalse',
                    target: 'Reading',
                    task: 'Read the text and mark the statements below that are TRUE.',
                    text: 'Brian sat down for dinner. He sat down in the chair. He sat down at the table. He looked at his white plate. He looked at his silver fork. He looked at his silver spoon. His dad said, "Pass me your plate, Brian." His dad put white rice on the plate. His dad put yellow corn on the plate. His dad put green peas on the plate. He gave the plate back to Brian. "This looks delicious," Brian said. "It is delicious," his dad said. Brian wondered why corn was yellow. He wondered why peas were green. He wondered if there were yellow peas and green corn.',
                    q: [
                        {id: 0, statement: 'Brian uses a spoon, a knife and a fork for eating.', add: false},
                        {id: 1, statement: 'Brian didn\'t like his food.', add: false},
                        {id: 2, statement: 'Brian wasn\'t going to eat alone.', add: false},
                        {id: 3, statement: 'Brian\'s spoon was made of the same metal as his fork.', add: false},
                        {id: 4, statement: 'Brian is most likely an adult.', add: false},
                       ],
                    c: [2, 3],
                    a: [],
                    result: 0
                }
            ],
            
                            listeningTrueOrFalseQuestions: [
                {
                    id: 1,
                    type: 'listeningTrueOrFalse',
                    target: 'Listening',
                    task: 'Listen to the audio and mark only TRUE statements below.',
                    audio: 'assets/audio/test-1-1.mp3',
                    q: [
                        {id: 0, statement: 'This might be a conversation between a father and a daughter.', add: false},
                        {id: 1, statement: 'The girl went to the cinema last night.', add: false},
                        {id: 2, statement: 'The girl was about to go to school, when the conversation happened.', add: false},
                        {id: 3, statement: 'The man asked the girl, if she wanted anything to eat.', add: false},
                        {id: 4, statement: 'The girl didn\'t want any coffee as of the moment of the conversation.', add: false}

                    ],
                    c: [0, 2, 3, 4],
                    a: [],
                    result: 0
                }
            ],
                
                            oddWordOutQuestions: [
                {
                    id: 0,
                    type: 'oddWordOut',
                    target: 'Lexis',
                    task: 'Select the word that doesn\'t fit with the other words.',
                    wordlist: [
                        'dog',
                        'cat',
                        'squirrel',
                        'rat',
                        'wolf',
                        'spaghetti'
                    ],
                    odd: 'spaghetti',
                    a: '',
                    result: 0
                },
                {
                    id: 1,
                    type: 'oddWordOut',
                    target: 'Lexis',
                    task: 'Select the word that doesn\'t fit with the other words.',
                    wordlist: [
                        'banana',
                        'apple',
                        'pencil',
                        'orange',
                        'pine apple',
                        'prune'
                    ],
                    odd: 'pencil',
                    a: '',
                    result: 0
                }
            ]
            
        
                
                        }, //end of level 1
                        {   //level 2
                            grammar: [
                                [
                                    {
                                        id: 0,
                                        type: 'multipleChoiceGrammar',
                                        target: 'Grammar',
                                        task: 'Choose correct options to insert in the sentence.',
                                        sentence: 'She looked _______ than usual.',
                                        q: [
                                            {id: 0, statement: 'more happy', add: false},
                                            {id: 1, statement: 'happier', add: false},
                                            {id: 2, statement: 'happyer', add: false},
                                            {id: 3, statement: 'as happy', add: false},
                                            {id: 4, statement: 'happy', add: false}
                                        ],
                                        c: [1],
                                        ref: [
                                            'http://www.ef.com/english-resources/english-grammar/comparative-and-superlative/'
                                        ]
                                    },
                                    {
                                        id: 1,
                                        type: 'multipleChoiceGrammar',
                                        target: 'Grammar',
                                        task: 'Choose correct options to insert in the sentence.',
                                        sentence: 'A plane goes faster _______ a plane.',
                                        q: [
                                            {id: 0, statement: 'as', add: false},
                                            {id: 1, statement: 'then', add: false},
                                            {id: 2, statement: 'so as', add: false},
                                            {id: 3, statement: 'than', add: false},
                                            {id: 4, statement: 'Nothing should be inserted', add: false}
                                        ],
                                        c: [3],
                                        ref: [
                                            'http://www.ef.com/english-resources/english-grammar/comparative-and-superlative/'
                                        ]
                                    }
                                    
                                ],
                                [
                                   {
                                        id: 2,
                                        type: 'multipleChoiceGrammar',
                                        target: 'Grammar',
                                        task: 'Choose correct options to insert in the sentence.',
                                        sentence: 'She plays tennis every _______.',
                                        q: [
                                            {id: 0, statement: 'day', add: false},
                                            {id: 1, statement: 'week', add: false},
                                            {id: 2, statement: 'Sundays', add: false},
                                            {id: 3, statement: 'after', add: false},
                                            {id: 4, statement: 'again', add: false}
                                        ],
                                        c: [0, 1],
                                        ref: [
                                            'http://www.grammar.cl/Basic/Adverbs_Frequency.htm'
                                        ]
                                    } 
                                ],
                                [
                                    {
                                        id: 3,
                                        type: 'multipleChoiceGrammar',
                                        target: 'Grammar',
                                        task: 'Choose correct options to insert in the sentence.',
                                        sentence: 'I always go skateboarding _______ Thursdays.',
                                        q: [
                                            {id: 0, statement: 'every', add: false},
                                            {id: 1, statement: 'on', add: false},
                                            {id: 2, statement: 'at', add: false},
                                            {id: 3, statement: 'in', add: false},
                                            {id: 4, statement: 'each', add: false}
                                        ],
                                        c: [1],
                                        ref: [
                                            'http://www.grammar.cl/Basic/Adverbs_Frequency.htm'
                                        ]
                                    },
                                    {
                                        id: 4,
                                        type: 'multipleChoiceGrammar',
                                        target: 'Grammar',
                                        task: 'Choose correct options to insert in the sentence.',
                                        sentence: 'I have a birthday _______ spring.',
                                        q: [
                                            {id: 0, statement: 'on', add: false},
                                            {id: 1, statement: 'at', add: false},
                                            {id: 2, statement: 'in', add: false},
                                        ],
                                        c: [2],
                                        ref: [
                                            'http://www.grammar.cl/Basic/Adverbs_Frequency.htm'
                                        ]
                                    },
                                ],
                                [
                                   {
                                        id: 5,
                                        type: 'multipleChoiceGrammar',
                                        target: 'Grammar',
                                        task: 'Choose correct options to insert in the sentence.',
                                        sentence: 'She is seeing a doctor _______.',
                                        q: [
                                            {id: 0, statement: 'an hour ago', add: false},
                                            {id: 1, statement: 'tomorrow', add: false},
                                            {id: 2, statement: 'yesterday', add: false},
                                            {id: 3, statement: 'in a minute', add: false},
                                            {id: 4, statement: 'soon', add: false},
                                        ],
                                        c: [1, 3, 4],
                                        ref: [
                                            'http://www.ef.com/english-resources/english-grammar/present-continuous/'
                                        ]
                                    },
                                    {
                                        id: 6,
                                        type: 'multipleChoiceGrammar',
                                        target: 'Grammar',
                                        task: 'Is this sentence GRAMMATICALLY correct?',
                                        sentence: 'I\'m thinking that beauty rules the world.',
                                        q: [
                                            {id: 0, statement: 'Yes', add: false},
                                            {id: 1, statement: 'No', add: false},
                                            
                                        ],
                                        c: [1],
                                        ref: [
                                            'http://www.ef.com/english-resources/english-grammar/present-continuous/'
                                        ]
                                    }
                                ],
                                [
                                    {
                                        id: 10,
                                        type: 'multipleChoiceGrammar',
                                        target: 'Grammar',
                                        task: 'Choose correct options to insert in the sentence.',
                                        sentence: 'I haven\'t seen him _______.',
                                        q: [
                                            {id: 0, statement: 'lately', add: false},
                                            {id: 1, statement: 'yesterday', add: false},
                                            {id: 2, statement: 'two days ago', add: false},
                                            {id: 3, statement: 'today', add: false},
                                            {id: 4, statement: 'recently', add: false}
                                        ],
                                        c: [0, 3, 4],
                                        ref: [
                                            'http://www.ef.com/english-resources/english-grammar/present-perfect/'
                                        ]
                                    }
                                ]
                            ], //end of grammar
                            grammar_Topics : [
                               'Comparative and Superlative forms',
                                'Frequency words',
                                'Time prepositions',
                                'Present Continuous',
                                'Present Perfect'
                            ],
                            matchQuestions: [],//end of match
                            textTrueOrFalseQuestions: [
                                {
                                    id: 1,
                                    type: 'textTrueOrFalse',
                                    target: 'Reading',
                                    task: 'Read the text and mark the statements below that are FALSE.',
                                    text: 'Three husbands met each other. The first one who was a soldier said: - Woman\'s tear is a classic weapon but very dangerous. The second one who was a weatherforcaster said: - Woman\'s tear is a light shower but it can become a flood that can dip many person\'s dead. The third one who was a chemist said: - Woman\'s tear is a special chemical that can ruin steely hearts.',
                                    q: [
                                        {id: 0, statement: 'The men who met were single.', add: false},
                                        {id: 1, statement: 'The statements expressed by the men were influenced by their occupations.', add: false},
                                        {id: 2, statement: 'The men agreed in that a woman\'s tear is potentially dangerous.', add: false},
                                        {id: 3, statement: 'None of the men compared a woman\'s tear with a natural phenomenon.', add: false},
                                        {id: 4, statement: 'The men who met worked in the same field.', add: false},
                                       ],
                                    c: [0, 3, 4],
                                    a: [],
                                    result: 0
                                }
                            ],//end of textTrueOrFalse
                            listeningTrueOrFalseQuestions: [
                                {
                                    id: 1,
                                    type: 'listeningTrueOrFalse',
                                    target: 'Listening',
                                    task: 'Listen to the audio and mark only TRUE statements below.',
                                    audio: 'assets/audio/test-2-1.mp3',
                                    q: [
                                        {id: 0, statement: 'Laura and John have never been in Paris.', add: false},
                                        {id: 1, statement: 'John wanted Laura to become his wife.', add: false},
                                        {id: 2, statement: 'John suggested that they spend a honeymoon in New York.', add: false},
                                        {id: 3, statement: 'Laura agreed to John\'s proposals.', add: false},
                                        {id: 4, statement: 'John didn\`t sound excited as he was making the proposal.', add: false}

                                    ],
                                    c: [1, 3],
                                    a: [],
                                    result: 0
                                }
                            ], //end of Listening
                            oddWordOutQuestions: [
                                {
                                    id: 0,
                                    type: 'oddWordOut',
                                    target: 'Lexis',
                                    task: 'Select the word that doesn\'t fit with the other words.',
                                    wordlist: [
                                        'car',
                                        'squirrel',
                                        'train',
                                        'underground',
                                        'horse',
                                        'trolleybus'
                                        
                                    ],
                                    odd: 'squirrel',
                                    a: '',
                                    result: 0
                                },
                                {
                                    id: 1,
                                    type: 'oddWordOut',
                                    target: 'Lexis',
                                    task: 'Select the word that doesn\'t fit with the other words.',
                                    wordlist: [
                                        'beef',
                                        'pork',
                                        'paultry',
                                        'steaks',
                                        'lettuce' 
                                    ],
                                    odd: 'lettuce',
                                    a: '',
                                    result: 0
                                }
                            ] //end of OddWordOut
                            
                        }, //end of level 2
                        {   //level 3
                            grammar: [
                                [
                                    {
                                        id: 0,
                                        type: 'multipleChoiceGrammar',
                                        target: 'Grammar',
                                        task: 'Which word can be inserted in the sentence to make it grammatically correct?',
                                        sentence: 'I\'ve missed several Maths lessons and _______ I got a low grade for Maths exam.',
                                        q: [
                                            {id: 0, statement: 'because', add: false},
                                            {id: 1, statement: 'consequently', add: false},
                                            {id: 2, statement: 'due to', add: false},
                                            {id: 3, statement: 'because of', add: false},
                                            {id: 4, statement: 'therefore', add: false}
                                        ],
                                        c: [
                                            1, 4
                                        ],
                                        ref: [
                                            
                                        ]
                                    },
                                    {
                                        id: 1,
                                        type: 'multipleChoiceGrammar',
                                        target: 'Grammar',
                                        task: 'Which word CANNOT be inserted in the sentence to make it grammatically correct?',
                                        sentence: 'We haven\'t managed to finish our work ________ bad weather.',
                                        q: [
                                            {id: 0, statement: 'because', add: false},
                                            {id: 1, statement: 'due to', add: false},
                                            {id: 2, statement: 'because of', add: false},
                                            {id: 3, statement: 'since', add: false},
                                        ],
                                        c: [
                                            0, 3
                                        ],
                                        ref: [
                                            
                                        ]   
                                    },
                                    {
                                        id: 2,
                                        type: 'multipleChoiceGrammar',
                                        target: 'Grammar',
                                        task: 'Which word or phrase can be inserted in the sentence to make it grammatically correct?',
                                        sentence: 'Despite _______, they\'ve managed to win the match.',
                                        q: [
                                            {id: 0, statement: 'their experience', add: false},
                                            {id: 1, statement: 'their lack of experience', add: false},
                                            {id: 2, statement: 'no experience of them', add: false},
                                            {id: 3, statement: 'being of no experience', add: false},
                                            {id: 4, statement: 'their inexperience', add: false}
                                        ],
                                        c: [
                                            1, 4
                                        ],
                                        ref: []
                                    }
                                ],
                                [
                                        {
                                            id: 3,
                                            type: 'multipleChoiceGrammar',
                                            target: 'Grammar',
                                            task: 'Which word can be inserted in the sentence to make it grammatically correct?',
                                            sentence: 'At this time I _______ back home tomorrow.',
                                            q: [
                                                {id: 0, statement: 'will fly', add: false},
                                                {id: 1, statement: 'will have flown', add: false},
                                                {id: 2, statement: 'will have been flying', add: false},
                                                {id: 3, statement: 'will be flying', add: false},
                                                {id: 4, statement: 'will have arrived', add: false}
                                            ],
                                            c: [
                                                3, 4
                                            ],
                                            ref: [
                                                'http://easy-english.com.ua/future-continuous/'
                                            ]
                                        },
                                        {
                                            id: 4,
                                            type: 'multipleChoiceGrammar',
                                            target: 'Grammar',
                                            task: 'Which sentence demonstrates correct use of Future Continuous?',
                                            sentence: '',
                                            q: [
                                                {id: 0, statement: 'Don\'t disturb me at 6 pm tomorrow, because I will be doing my homework at this time.', add: false},
                                                {id: 1, statement: 'I will be waiting at the stop, when your bus arrives.', add: false},
                                                {id: 2, statement: 'Don\'t be late tomorrow! - I will be trying!', add: false},
                                                {id: 3, statement: 'All sentences are correct.', add: false},
                                            ],
                                            c: [
                                                0, 1
                                            ],
                                            ref: [
                                                'http://easy-english.com.ua/future-continuous/'
                                            ]
                                        },
                                        {
                                            id: 5,
                                            type: 'multipleChoiceGrammar',
                                            target: 'Grammar',
                                            task: 'Which phrase can be inserted in the sentence to make it grammatically correct?',
                                            sentence: 'What time _______ for school tomorrow?',
                                            q: [
                                                {id: 0, statement: 'will you leaving', add: false},
                                                {id: 1, statement: 'will you be leaving', add: false},
                                                {id: 2, statement: 'you will leave', add: false},
                                                {id: 3, statement: 'you will be leaving', add: false},
                                                {id: 4, statement: 'will leave', add: false}
                                            ],
                                            c: [
                                                1
                                            ],
                                            ref: [
                                                'http://easy-english.com.ua/future-continuous/'
                                            ]
                                        }
                                ],
                                [
                                    {
                                            id: 7,
                                            type: 'multipleChoiceGrammar',
                                            target: 'Grammar',
                                            task: 'Which phrase can be inserted in the sentence to make it grammatically correct?',
                                            sentence: 'The bus should have _______ by now.',
                                            q: [
                                                {id: 0, statement: 'left', add: false},
                                                {id: 1, statement: 'been left', add: false},
                                                {id: 2, statement: 'be leaving', add: false},
                                                {id: 3, statement: 'not left', add: false},
                                                {id: 4, statement: 'been leaving', add: false}
                                            ],
                                            c: [
                                                0
                                            ],
                                            ref: [
                                                'http://easy-english.com.ua/future-continuous/'
                                            ]
                                    },
                                    {
                                            id: 8,
                                            type: 'multipleChoiceGrammar',
                                            target: 'Grammar',
                                            task: 'Which sentence (s) is/are grammatically correct?',
                                            sentence: '',
                                            q: [
                                                {id: 0, statement: 'I shouldn\'t shout at him.', add: false},
                                                {id: 1, statement: 'I shouldn\'t will shout at him.', add: false},
                                                {id: 2, statement: 'I shouldn\'t have to shout at him.', add: false},
                                                {id: 3, statement: 'I shouldn\'t have shouted at him.', add: false},
                                                {id: 4, statement: 'I shouldn\'t have shouting at him.', add: false}
                                            ],
                                            c: [
                                                0, 3
                                            ],
                                            ref: [
                                                'http://easy-english.com.ua/future-continuous/'
                                            ]
                                    },
                                    {
                                            id: 9,
                                            type: 'multipleChoiceGrammar',
                                            target: 'Grammar',
                                            task: 'Which sentence expresses a similar meaning? \n\n I went to the city center during rush hour. Now I regret it.',
                                            sentence: '',
                                            q: [
                                                {id: 0, statement: 'I should go to the city center during rush hour.', add: false},
                                                {id: 1, statement: 'I didn\'t have to go to the city center during rush hour.', add: false},
                                                {id: 2, statement: 'I shouldn\'t have went to the city center during rush hour.', add: false},
                                                {id: 3, statement: 'I shouldn\'t have left my home.', add: false},
                                                {id: 4, statement: 'I shouldn\'t have gone the city center during rush hour.', add: false}
                                            ],
                                            c: [
                                               4
                                            ],
                                            ref: [
                                                'http://easy-english.com.ua/future-continuous/'
                                            ]
                                    }
                                    
                                ],
                                [
                                    {
                                            id: 10,
                                            type: 'multipleChoiceGrammar',
                                            target: 'Grammar',
                                            task: 'Which sentence expresses a similar meaning? \n\n He started talking before the teacher entered the classroom, and continued talking afterwards.',
                                            sentence: '',
                                            q: [
                                                {id: 0, statement: 'He talked, when the teacher entered the classroom.', add: false},
                                                {id: 1, statement: 'He talked, when the teacher was entering the classroom.', add: false},
                                                {id: 2, statement: 'He was talking, when the teacher entered the classroom.', add: false},
                                                {id: 3, statement: 'He talked and the teacher entered the classroom.', add: false},
                                                {id: 4, statement: 'As he was talking, the teacher was entering the classroom.', add: false}
                                            ],
                                            c: [
                                               2
                                            ],
                                            ref: [
                                                'http://easy-english.com.ua/future-continuous/'
                                            ]
                                    },
                                    {
                                            id: 11,
                                            type: 'multipleChoiceGrammar',
                                            target: 'Grammar',
                                            task: 'Complete the sentence.',
                                            sentence: 'My brother and I _______ sleeping at this time yesterday.',
                                            q: [
                                                {id: 0, statement: 'were', add: false},
                                                {id: 1, statement: 'was', add: false},
                                                {id: 2, statement: 'are', add: false},
                                                {id: 3, statement: 'did', add: false},
                                                {id: 4, statement: 'wasn\'t', add: false}
                                            ],
                                            c: [
                                               0
                                            ],
                                            ref: [
                                                'http://easy-english.com.ua/future-continuous/'
                                            ]
                                    },
                                    {
                                            id: 11,
                                            type: 'multipleChoiceGrammar',
                                            target: 'Grammar',
                                            task: 'Choose one or several options to complete the sentence.',
                                            sentence: 'I _______ reading, when he came.',
                                            q: [
                                                {id: 0, statement: 'were', add: false},
                                                {id: 1, statement: 'was', add: false},
                                                {id: 2, statement: 'did', add: false},
                                                {id: 3, statement: 'wasn\'t', add: false}
                                            ],
                                            c: [
                                               1, 3
                                            ],
                                            ref: [
                                                
                                            ]
                                    }
                                ],
                                [
                                    {
                                            id: 12,
                                            type: 'multipleChoiceGrammar',
                                            target: 'Grammar',
                                            task: 'Choose one or several options to complete the sentence.',
                                            sentence: 'When I met her, I had a feeling that I _______ her before.',
                                            q: [
                                                {id: 0, statement: 'have seen', add: false},
                                                {id: 1, statement: 'had seen', add: false},
                                                {id: 2, statement: 'would have seen', add: false},
                                                {id: 3, statement: 'was seeing', add: false}
                                            ],
                                            c: [
                                               1
                                            ],
                                            ref: [
                                                
                                            ]
                                    },
                                    {
                                            id: 13,
                                            type: 'multipleChoiceGrammar',
                                            target: 'Grammar',
                                            task: 'Choose one or several options to complete the sentence.',
                                            sentence: 'When I got home he was waiting for me. He had _______ before me.',
                                            q: [
                                                {id: 0, statement: 'came', add: false},
                                                {id: 1, statement: 'coming', add: false},
                                                {id: 2, statement: 'come', add: false},
                                                {id: 3, statement: 'will come', add: false}
                                            ],
                                            c: [
                                               2
                                            ],
                                            ref: [
                                                
                                            ]
                                    }
                                ]
                                      
                            ], //end of grammar
                            grammar_Topics: [
                                'Words of cause and effect',
                                'Future Contiuous',
                                'Should have done/might have done etc...',
                                'Past Continuous',
                                'Past Perfect'
                            ],
                            matchQuestions: [
                                {
                                    id: 0,
                                    type: 'match',
                                    target: 'Lexis',
                                    task: 'Match words in left column with their SYNONYMS in the right column',
                                    left: [
                                        {id: 0, word: 'complex', add: false},
                                        {id: 1, word: 'exciting', add: false},
                                        {id: 2, word: 'fierce', add: false},
                                        {id: 3, word: 'ugly', add: false},
                                        {id: 4, word: 'due', add: false},
                                        {id: 5, word: 'urgent', add: false}
                                    ],
                                    right: [
                                        {id: 0, word: 'cruel', add: false},
                                        {id: 1, word: 'sophisticated', add: false},
                                        {id: 2, word: 'appropriate', add: false},
                                        {id: 3, word: 'pressing', add: false},
                                        {id: 4, word: 'thrilling', add: false},
                                        {id: 5, word: 'unsightly', add: false},
                                        
                                    ],
                                    c: [
                                        [
                                           0,
                                            1,
                                            2,
                                            3,
                                            4,
                                            5
                                        ],
                                        [
                                           1,
                                            4,
                                            0,
                                            5,
                                            2,
                                            3
                                        ]
                                    ],
                                    userInput: [
                                        [],
                                        []
                                    ],
                                    result: 0
                                },
                                {
                                    id: 0,
                                    type: 'match',
                                    target: 'Lexis',
                                    task: 'Match phrasal verbs in the left column with their SYNONYM verbs in the right column.',
                                    left: [
                                        {id: 0, word: 'give up', add: false},
                                        {id: 1, word: 'come across', add: false},
                                        {id: 2, word: 'go on', add: false},
                                        {id: 3, word: 'blow up', add: false},
                                        {id: 4, word: 'make up', add: false},
                                        {id: 5, word: 'run down', add: false}
                                    ],
                                    right: [
                                        {id: 0, word: 'continue', add: false},
                                        {id: 1, word: 'explode', add: false},
                                        {id: 2, word: 'contrive', add: false},
                                        {id: 3, word: 'abandon', add: false},
                                        {id: 4, word: 'mistreat', add: false},
                                        {id: 5, word: 'encounter', add: false},
                                        
                                    ],
                                    c: [
                                        [
                                           0,
                                            1,
                                            2,
                                            3,
                                            4,
                                            5
                                        ],
                                        [
                                           3,
                                            5,
                                            0,
                                            1,
                                            2,
                                            4
                                        ]
                                    ],
                                    userInput: [
                                        [],
                                        []
                                    ],
                                    result: 0
                                }
                            ],//end of match
                            textTrueOrFalseQuestions: [
                                {
                                    id: 1,
                                    type: 'textTrueOrFalse',
                                    target: 'Reading',
                                    task: 'Read the text and mark the statements below that are TRUE.',
                                    text: 'Thirty years ago, two Hungarian educators, László and Klara Polgár, decided to challenge the popular assumption that women don’t succeed in areas requiring spatial thinking, such as chess. They wanted to make a point about the power of education. The Polgárs homeschooled their three daughters, and as part of their education the girls started playing chess with their parents at a very young age. Their systematic training and daily practice paid off. By 2000, all three daughters had been ranked in the top ten female players in the world. The youngest, Judit, had become a grand master at age 15, breaking the previous record for the youngest person to earn that title, held by Bobby Fischer, by a month. Today Judit is one of the world’s top players and has defeated almost all the best male players. \n\n It’s not only assumptions about gender differences in expertise that have started to crumble. Back in 1985, Benjamin Bloom, a professor of education at the University of Chicago, published a landmark book, Developing Talent in Young People, which examined the critical factors that contribute to talent. He took a deep retrospective look at the childhoods of 120 elite performers who had won international competitions or awards in fields ranging from music and the arts to mathematics and neurology. Surprisingly, Bloom’s work found no early indicators that could have predicted the virtuosos’ success. Subsequent research indicating that there is no correlation between IQ and expert performance in fields such as chess, music, sports, and medicine has borne out his findings. The only innate differences that turn out to be significant—and they matter primarily in sports—are height and body size.\n\nSo what does correlate with success? One thing emerges very clearly from Bloom’s work: All the superb performers he investigated had practiced intensively, had studied with devoted teachers, and had been supported enthusiastically by their families throughout their developing years. Later research building on Bloom’s pioneering study revealed that the amount and quality of practice were key factors in the level of expertise people achieved. Consistently and overwhelmingly, the evidence showed that experts are always made, not born.\n\n Source: https://hbr.org/2007/07/the-making-of-an-expert',
                                    q: [
                                        {id: 0, statement: 'The Polgars\' experiment turned out to be successful.', add: false},
                                        {id: 1, statement: 'When Judit Polgar became a grandmaster, she was one month younger than Bobby Fischer was, when he achieved the same level.', add: false},
                                        {id: 2, statement: 'It is clear from the text that Judit Polgar competed only with women chess players.', add: false},
                                        {id: 3, statement: 'The Polgars\' experiment failed to change any stereotypes popular as of his time.', add: false},
                                        {id: 4, statement: 'Benjamin Bloom studied people with various backgrounds.', add: false},
                                        {id: 5, statement: 'Benjamin Bloom argues in his work that one\'s success is determined as early as in one\'s childhood.', add: false},
                                        {id: 6, statement: 'Later studies totally contradicted Bloom\'s findings.', add: false},
                                        {id: 7, statement: 'This article promotes fatalistic view on expertise.', add: false},
                                       ],
                                    c: [0, 1, 4],
                                    a: [],
                                    result: 0
                                }
                            ],//end of textTrueOrFalse
                            listeningTrueOrFalseQuestions: [], //end of Listening
                            oddWordOutQuestions: [] //end of OddWordOut
                        } //end of level 3
                    ] //end of levels
    }
    
    //TODO: Add other tests
    
    var tests = [
        englishPlacementTest
    ]
    return {
        testResultResource: testResultResource,
        getTests: function(){
            return tests;
        }
    }    
    
}])
.factory('captchaFactory', [function(){
    var captchas = [
        {
            id: 0,
            pic: 'assets/captcha1.png',
            text: '128qs'
        },
        {
            id: 1,
            pic: 'assets/captcha2.png',
            text: 'crj11s'
        }
    ]
    return {
        getCaptcha: function(){
            var ind = Math.floor(Math.random()*captchas.length);
            return captchas[ind];
        },
        checkCaptcha: function(input, ind){
            if (captchas[ind].text.toLowerCase() == input.toLowerCase()) return true
            else return false
        }
    }
}])
