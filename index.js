const express=require('express');
const mongoose=require('mongoose');
const taskModel = require("./task");
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))

mongoose.connect("mongodb://localhost/task",()=>{
    console.log("db connected")
},(err)=>{
    console.log(err);
})
let count = 0;
//Test-Case:1
app.post("/v1/tasks",(req,res)=>{
     taskModel.find({title:req.body.title})
     .then((val)=>{
        if(!val.length){
             count++;
             taskModel.create({
                id:count,
                title:req.body.title
             }).then((data)=>{
                res.status(201).send({id:data.id})
             }).catch((err)=>{
                res.status(400).send(err.message)
             })
        }
        else{
            res.status(400).send("Task is already present")
        }
     })
})

//Test-Case:2
app.get("/v1/tasks",(req,res)=>{
     taskModel.find().then((data)=>{
        res.status(200).send(data)
     }).catch((err)=>{
        res.status(400).send(err.message)
     })
})
//Test-Case:3
app.get("/v1/tasks/:id",(req,res)=>{
     taskModel.find({id:req.params.id})
     .then((data)=>{
        if(data.length){
            res.status(200).send(data[0])
        }
        else{
            res.status(404).send("There is no task at that id")
        }
     }).catch((err)=>{
        res.status(400).send(err.message)
     })
})
//Test-Case:4
app.delete("/v1/tasks/:id",(req,res)=>{
     taskModel.deleteOne({id:req.params.id})
     .then((data)=>{
        res.status(204).send("Task deleted successfully");
     }).catch((err)=>{
        res.status(204).send("Task deleted successfully")
     })
})
//Test-Case:5
app.put("/v1/tasks/:id",(req,res)=>{
     taskModel.find({id:req.params.id})
     .then((data)=>{
        if(data.length){
        taskModel.updateOne({id:req.params.id},{$set:{
            title:req.body.title,
            iscompleted:req.body.iscompleted
        }}).then(()=>{
            res.status(200).send("updated successfully")
        }).catch((err)=>{
            res.status(404).send("There is no task at that id")
        
        })
    }else{
        res.status(404).send("There is no task at that id")
    }
     })
})
//Test-Case:6
app.post("/v1/tasks",(req,res)=>{
     let addTasks=req.body.tasks;
     let arr=[];
     for(let i=0;i<addTasks.length;i++){
        taskModel.find({title:addTasks[i].title})
        .then((val)=>{
            if(!val.length){
                count++
                taskModel.create({
                    id:count,
                    title:addTasks[i].title,
                    iscompleted:addTasks[i].iscompleted
                }).then((data)=>{
                    arr.push({id:data.id})
                }).catch((err)=>{
                    res.status(400)
                })
            }
        })
     }
     res.status(201).send("All the tasks added successfully")
})
//Test-Case:7
app.delete("/v1/tasks",(req,res)=>{
     let delTasks=req.body.tasks
     for(let i=0;i<delTasks.length;i++){
        taskModel.deleteOne({id:delTasks[i].id})
        .then(()=>{
            res.status(200)
        }).catch((err)=>{
            res.status(400)
        })
     }
     res.status(200).send("All the task deleted successfully")
})
app.listen(5000,()=>console.log("Server Running"))