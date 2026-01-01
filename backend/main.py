from fastapi import FastAPI, Path, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
# from models import Products
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Annotated, List, Dict, Literal, Optional
from annotated_types import Len
import json

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Marks(BaseModel):
    math: Annotated[float, Field(default=0.0, description='Marks student received in math',ge=0,le=50)]
    science: Annotated[float, Field(default=0.0, description='Marks student received in science',ge=0,le=50)]
    social: Annotated[float, Field(default=0.0, description='Marks student received in social',ge=0,le=50)]

class WeakArea(BaseModel):
    math: Annotated[List[str],Len(max_length=5),Field(default=[], description="Weak areas in math")]
    science: Annotated[List[str],Len(max_length=5),Field(default=[], description="Weak areas in science")]
    social: Annotated[List[str],Len(max_length=5),Field(default=[], description="Weak areas in social studies")]

class Guardian(BaseModel):
    name: Annotated[str,Field(...,description="Name of guardian")]
    relation: Annotated[str,Field(...,description="Relation of guardian with student")]
    contact: Annotated[str,Field(...,description="Contact of guardian")]

    @field_validator('contact')
    @classmethod
    def verify_contact(cls,value):
        if len(value)!=10:
            raise ValueError('Enter correct mobile number')
        return value

class Student(BaseModel):
    roll_no: Annotated[str, Field(...,description='Roll no of student')]
    name: Annotated[str,Field(...,description='Name of the student')]
    gender: Annotated[Literal['Male','Female','other'],Field(...,description='Gender of student')]
    marks: Annotated[Optional[Marks],Field(default=None,description='Marks of each subject')]
    weak_areas: Annotated[Optional[WeakArea],Field(default=None,description='Weak areas of each subject')]
    guardian: Annotated[Guardian, Field(...,description='Details of guardian')]

    @model_validator(mode='after')
    def check_marks(cls, model):
        if not model.marks and model.weak_areas:
            raise ValueError('Weak areas cannot exist without marks')
        elif model.marks and not model.weak_areas:
            subjects_marks = [
    ('math', model.marks.math),
    ('science', model.marks.science),
    ('social', model.marks.social)
]
            for i,marks_lst in subjects_marks:
                if marks_lst<30:
                    raise ValueError('Weak areas must exists marks less than 30')
        else:
            subjects = [
    ('math', model.marks.math, model.weak_areas.math),
    ('science', model.marks.science, model.weak_areas.science),
    ('social', model.marks.social, model.weak_areas.social)
]
            for i, marks_value, weak_list in subjects:
                if len(weak_list)<=5:
                    # if marks_value>=30 and len(weak_list)>0:
                    #     raise ValueError('Weak areas is not needed if marks is greater than 30')
                    # el
                    if marks_value<30 and len(weak_list)==0:
                        raise ValueError('Marks less than 30 must have weak area(atleast 1)')
                else:
                    raise ValueError('Too many weak areas')
                
        return model
    
class StudentUpdate(BaseModel):
    name: Annotated[Optional[str],Field(default=None)]
    gender: Annotated[Optional[Literal['Male','Female','other']],Field(default=None)]
    marks: Annotated[Optional[Marks],Field(default=None,description='Marks of each subject')]
    weak_areas: Annotated[Optional[WeakArea],Field(default=None,description='Weak areas of each subject')]
    guardian: Annotated[Optional[Guardian], Field(default=None)]


def load_data():
    with open('students.json', 'r') as f:
        data = json.load(f)

    return data

def save_data(data):
    with open('students.json', 'w') as f:
        json.dump(data, f)

@app.get('/')
def greet():
    return {'message':'Student Management System API'}

@app.get('/about')
def about():
    return {'message':'A fully functional API to manage your student performance'}

@app.get('/view')
def view():
    data = load_data()
    return data

@app.get('/student/{student_id}')
def get_student(student_id: str = Path(..., description='ID of student in DB', example='S001')):
    data = load_data()
    if student_id in data:
        return data[student_id]
    raise HTTPException(status_code=404, detail="Student ID not found in DB")

@app.get('/sort')
def sort_students(sort_by: str = Query(..., description='Sort by roll number, alphabetical'), order: str = Query('asc', description='Sort in asc or desc order')):
    valid_fields = ['Roll no', 'name']

    if sort_by not in valid_fields:
        raise HTTPException(status_code=400, detail=f"Invalid field select from {valid_fields}")
    
    if order not in ['asc','desc']:
        raise HTTPException(status_code=400,detail='Invalid order select')
    
    data = load_data()

    sort_order = True if order=='desc' else False

    sorted_data = sorted(data.values(), key=lambda x: x.get(sort_by,0), reverse=sort_order)

    return sorted_data

@app.post('/add')
def add_student(student: Student):
    print(f"Student object: {student}")
    print(f"Student type: {type(student)}")
    #step 1: Load data
    data = load_data()

    #step 2: check if the student already exists
    if student.roll_no in data:
        raise HTTPException(status_code=400,detail='Already exists')
    # add new student to existing data
    data[student.roll_no] = student.model_dump(exclude=['roll_no'])

    #save into json
    save_data(data)
    
    return JSONResponse(status_code=200, content={'message': 'student added'})

@app.put('/edit/{student_id}')
def update_student(student_id:str, student_update: StudentUpdate):

    data = load_data()
    if student_id not in data:
        raise HTTPException(status_code=400,detail='not in data')
    
    existing_student = data[student_id]
    print(existing_student)
    print(student_update)
    updated_student = student_update.model_dump(exclude_unset=True)
    print(updated_student)

    for key,value in updated_student.items():
        nested_dict = ['marks', 'weak_areas', 'guardian']
        if key in nested_dict:
            print(value.items())
            for inner_key, inner_value in value.items():
                existing_student[key][inner_key] = inner_value
        else:
            existing_student[key] = value

    existing_student['roll_no'] = student_id
    pydantic_stud = Student(**existing_student)
    existing_student = pydantic_stud.model_dump(exclude='roll_no')

    data[student_id] = existing_student

    save_data(data)

    return JSONResponse(status_code=200,content={'message':"student updated successfully"})


@app.delete('/delete/{student_id}')
def delete_student(student_id:str):
    #step-1: load data
    data = load_data()
    #step-2: check if student id present in data or not
    if student_id not in data:
        raise HTTPException(status_code=404,detail='Student not found')
    #step-3: if data present delete it
    del data[student_id]
    #step-4: save the data
    save_data(data)

    return JSONResponse(status_code=200,content={'message':'student data deleted'})