import { sequelize, seq } from "./db.config";

interface Code_boardAttributes {
    id : number,
    title: string,
    language : string,
    code : string,
    created : Date,
    user_id: number,
    code_jobs_id: number,
    like: number,
    state: number
}

export class Code_board extends seq.Model<Code_boardAttributes> implements Code_boardAttributes{
    public readonly id!: number;
    public title!: string;
    public language!: string;
    public code!: string;
    public created!: Date;
    public user_id: number;
    public code_jobs_id: number;
    public like: number;
    public state: number;
}

Code_board.init(
    {
        id : {
            type: seq.INTEGER,
            primaryKey: true,
            autoIncrement : true
        },
        title:{
            type: seq.STRING
        },
        language:{
            type: seq.STRING
        },
        code:{
            type: seq.TEXT
        },
        created:{
            type: seq.DATE
        },
        user_id:{
            type: seq.INTEGER,
            references: {
                model: 'User',
                key: 'no'
            }
        },
        code_jobs_id:{
            type: seq.INTEGER,
            references: {
                model: 'Code_jobs',
                key: 'id'
            }
        },
        like:{
            type: seq.INTEGER
        },
        state:{
            type: seq.INTEGER
        }
    },{
        modelName: 'Code_board',
        tableName: 'Code_board',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export interface Code_boardReq{
    title:string,
    language : string,
    code : string,
    user_id: number,
}

export interface Code_boardRes{
    id : number,
    title: string,
    language : string,
    code : string,
    status : string,
    error : Date,
    status_updated : number,
    output: string,
    user_id: number,
    like: number,
}

export interface Code_boardUpdate{
    title: string,
    language : string,
    code : string,
}