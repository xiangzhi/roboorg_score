var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('views','public/views')
app.engine('handlebars', exphbs({layoutsDir:'public/views/', defaultLayout: 'main.handlebars'}));
app.set('view engine', 'handlebars');

team_list = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','Rho']
course_list = ['1','2','3','4']
difficulty_list = [1,2,3,4]
// standing = [
//     {
//         'name':'A',
//         'course':['C','P','C','C'],
//         'time':100,
//         'distance':100,
//         'done':true
//     },
//     {
//         'name':'B',
//         'course':['P','P','P',''],
//         'time':120,
//         'distance':130,
//         'done':false
//     }
// ]

standing = []

function count_complete(arr){
    var count = 0
    for(var i = 0; i < arr.length; i++){
        if(arr[i] == 'C'){
            count += 1
        }
    }
    return count
}

function count_difficulty_score(arr){
    var score = 0
    for(var i = 0 ; i <4 ;i++){
        if(arr[i] == 'C'){
            score += difficulty_list[i]
        }
    }
    return score    
}

function winnerFunction(a,b){
    // returns an integer
    // < 0 --- a is better
    // > 0 --- b is beter

    //Step 1 compare the number of completed course
    a_count = count_complete(a.course)
    b_count = count_complete(b.course)
    diff = b_count - a_count
    if(diff != 0){
        return diff
    }

    //Step 2 compare the ranking of the scores
    a_diff = count_difficulty_score(a.course)
    b_diff = count_difficulty_score(b.course)
    diff = b_diff - a_diff
    if(diff != 0){
        return diff
    }

    //Step 3 compare the total time
    diff = a.time - b.time
    if(diff != 0){
        return diff
    }

    //Step 4 compare the total distance
    diff = a.distance - b.distance
    if(diff == 0){
        console.log("WE HAVE A SUPER TIEEEE")
    }
    return diff 
}

function calculate_winner(info){


    var standing = []
    for(var team in info){
        standing.push(info[team])
    }

    standing.sort(winnerFunction)
    return standing
}   



team_info = {}
//load team_info if 'backup.json' exist
if(fs.existsSync("backup.json")){
    team_info = JSON.parse(fs.readFileSync('backup.json'))
    console.log("LOADED from File")
    standing = calculate_winner(team_info)
}


app.get('/', function (req, res) {
    today = new Date();
    var date = (today.getMonth()+1)+'/'+today.getDate() + '/' + today.getFullYear();
    var cur_time = " "+ today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    res.render('score',{'standing':standing,
    helpers:{
        inc: function(i){return parseInt(i)+1},
        complete: function(course, block){
            count = 0
            for(var i = 0; i < course.length; i++){
                if(course[i] != ''){
                    count += 1
                } 
            }
            if(count >= 4){
                //console.log(block)
                return block.fn(this)
            }
        },
        trophy: function(index){
            if(index <= 2){
                return 'fa fa-trophy'
            }
        },
        trophy_color: function(index){
            if(index == 0){
                return 'font-size:24px;color:gold'
            }
            else if(index == 1){
                return 'font-size:20px;color:silver'
            }
            else{
                return 'font-size:16px;color:bronze'
            }
        }
    },
    time:(date + cur_time)
    });
});

app.post('/add', function(req, res){

    team_name = req.body.team
    //never seen team, add
    if(!(team_name in team_info)){
        //create an empty obkect
        team_info[team_name] = {
            'name':team_name,
            'distance':0,
            'done':false,
            'time':0,
            'completed':0,
            'diff_score':0,
            'course':['','','','']
        }
    }

    //update information in the team_info
    course_number = parseInt(req.body.course) - 1
    course_status = req.body.status
    if(course_status == 'Complete'){
        course_status = 'C'        
    }
    else if(course_status == 'Failed'){
        course_status = 'I'
    }
    else{
        course_status = ''
    }

    req.body.time = (isNaN(parseFloat(req.body.time)))?0:parseFloat(req.body.time) 
    req.body.distance = (isNaN(parseFloat(req.body.distance)))?0:parseFloat(req.body.distance) 
    
    team_info[team_name].course[course_number] = course_status
    team_info[team_name].time += req.body.time
    team_info[team_name].distance += req.body.distance

    //count diff score
    team_info[team_name].diff_score = count_difficulty_score(team_info[team_name].course)

    //save info if crash
    fs.writeFileSync('backup.json',JSON.stringify(team_info))

    //now we rerank the team_info
    standing = calculate_winner(team_info)
    //console.log(standing)
    res.redirect('add_done')
    //res.end('success')
})  

app.get('/add', function (req, res) {
    res.render('add',{'team':team_list,'course':course_list});
});

app.get('/add_done',function(req, res){
    res.render('add_done')
    //res.redirect('/add')
})

app.get('/test', function(req, res){
    res.end("test");
})

app.listen(3000);