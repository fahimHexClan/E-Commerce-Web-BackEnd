import Student from "../models/student.js";

function getStudents (req,res){

    Student.find().then((studentList)=>{
        res.json({
            list:studentList
        })
    }).catch((err)=>{
        res.json({
            message:"student not found"
        })
    })
}

function createStudent(req,res){    

    const student=new Student(req.body)
  
    student.save().then((student)=>{
  
      res.json({
          message:"student saved successfully",
    })
  
    }).catch((err)=>{
  
      res.json({
          message:"student not saved"
          })
    })
  }

function deleteStudent(req,res){
  
  Student.deleteOne({name : req.body.name}).then(()=>{
  
      res.json({
          message:"student deleted successfully",
      })
  
  }).catch((err)=>{
  
      res.json({
          message:"student not deleted"
      })
  })
  
  }


function updateStudent(req,res){
  
  const id=req.params.id;
  
  Student.findByIdAndUpdate(id,req.body).then((student)=>{
  
      res.json({
          message:"student updated successfully",
      })
  
  }).catch((err)=>{
  
      res.json({
          message:"student not updated"
      })
  })
  
  }


export {getStudents,createStudent,deleteStudent,updateStudent}