import { sequelize, seq } from "./db.config";

interface AnswerAttributes {
    id : number,
    content: string,
    user_id: number,
    parent_id: number,
    created: Date,
    state: number,
    is_selected: number,
    like: number,
}

export class Answer extends seq.Model<AnswerAttributes> implements AnswerAttributes{
    public readonly id!: number;
    public content!: string;
    public user_id!: number;
    public parent_id!: number;
    public created!: Date;
    public state!: number;
    public is_selected!: number;
    public like!: number;
}

Answer.init(
    {
        id : {
            type: seq.INTEGER,
            primaryKey: true,
            autoIncrement : true
        },
        content:{
            type: seq.TEXT
        },
        user_id:{
            type: seq.INTEGER,
            references: {
                model: 'User',
                key: 'no'
            }
        },
        parent_id:{
            type: seq.INTEGER,
            references: {
                model: 'Question',
                key: 'id'
            }
        },
        created:{
            type: seq.DATE
        },
        state:{
            type: seq.INTEGER
        },
        is_selected:{
            type: seq.INTEGER
        },
        like:{
            type: seq.INTEGER
        }
    },{
        modelName: 'Answer',
        tableName: 'Answer',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export interface AnswerReq{
    content: string,
    user_id: number,
    parent_id: number,
}