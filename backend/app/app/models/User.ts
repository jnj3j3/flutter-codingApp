import { sequelize, seq } from "./db.config";

interface UserAttributes {
    no : number,
    nickname : string,
    id : string,
    password : string,
    created : Date,
    state: number
}

export class User extends seq.Model<UserAttributes> implements UserAttributes{
    public readonly no!: number;
    public nickname!: string;
    public id!: string;
    public password!: string;
    public created!: Date;
    public state!: number;
}

User.init(
    {
        no : {
            type: seq.INTEGER,
            primaryKey: true,
            autoIncrement : true
        },
        nickname:{
            type: seq.STRING,
            unique: true
        },
        id:{
            type: seq.STRING,
            unique: true
        },
        password:{
            type: seq.STRING
        },
        created:{
            type: seq.DATE
        },
        state:{
            type: seq.INTEGER
        }
    },{
        modelName: 'User',
        tableName: 'User',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);


export interface UserReq{
    id : string,
    password : string,
    nickname : string,
}