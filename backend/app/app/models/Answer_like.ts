import { sequelize, seq } from "./db.config";

interface Answer_likeAttributes {
    answer_id: number,
    user_id: number,
    created: Date,
    state: number
}

export class Answer_like extends seq.Model<Answer_likeAttributes> implements Answer_likeAttributes{
    public answer_id: number;
    public user_id: number;
    public created: Date;
    public state: number;
}

Answer_like.init(
    {
        answer_id : {
            type: seq.INTEGER,
            primaryKey: true,
            references: {
                model: 'Answer',
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
        modelName: 'Answer_like',
        tableName: 'Answer_like',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export interface Answer_likeReq{
    answer_id: number,
    user_id: number,
}