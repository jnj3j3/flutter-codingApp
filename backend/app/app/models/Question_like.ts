import { sequelize, seq } from "./db.config";

interface  Question_likeAttributes {
    question_id: number,
    user_id: number,
    created: Date,
    state: number
}

export class Question_like extends seq.Model<Question_likeAttributes> implements Question_likeAttributes{
    public question_id: number;
    public user_id: number;
    public created: Date;
    public state: number;
}

Question_like.init(
    {
        question_id : {
            type: seq.INTEGER,
            primaryKey: true,
            references: {
                model: 'Question',
                key: 'id'
            }
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
        }
    },{
        modelName: 'Question_like',
        tableName: 'Question_like',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);


export interface question_likeReq{
    question_id: number,
    user_id: number,
}