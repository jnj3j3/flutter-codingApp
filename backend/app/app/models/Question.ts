import { sequelize, seq } from "./db.config";

interface QuestionAttributes {
    id : number,
    title: string,
    content: string,
    user_id: number,
    created: Date,
    state: number,
    is_clear: number,
    views: number,
    like: number,
}

export class Question extends seq.Model<QuestionAttributes> implements QuestionAttributes{
    public readonly id!: number;
    public title!: string;
    public content!: string;
    public user_id!: number;
    public created!: Date;
    public state!: number;
    public is_clear!: number;
    public views!: number;
    public like!: number;
}

Question.init(
    {
        id : {
            type: seq.INTEGER,
            primaryKey: true,
            autoIncrement : true
        },
        title:{
            type: seq.STRING
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
        created:{
            type: seq.DATE
        },
        state:{
            type: seq.INTEGER
        },
        is_clear:{
            type: seq.INTEGER
        },
        views:{
            type: seq.INTEGER
        },
        like:{
            type: seq.INTEGER
        }
    },{
        modelName: 'Question',
        tableName: 'Question',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export interface QuestionReq{
    title: string,
    content: string,
    user_id: number
}