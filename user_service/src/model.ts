import mongoose ,{Document,Schema}from 'mongoose';
export interface IUser extends Document {

    name:string,
    email:string,
    password:string,
    role:string,
    playlist:string[]
}

const schema:Schema<IUser>=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"admin"
    },
    playlist:[{
        type:String,
        require:true,
    }]
},{timestamps:true})

export const User=mongoose.model<IUser>("User",schema)

