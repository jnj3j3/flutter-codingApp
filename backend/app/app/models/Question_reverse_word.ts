import { sequelize, seq } from "./db.config";

interface  Question_reverse_wordAttributes {
    id: number,
    word_id: number,
    question_id: number,
    count: number
    weight: number
}    

export class Question_reverse_word extends seq.Model<Question_reverse_wordAttributes> implements Question_reverse_wordAttributes{
    public readonly id: number;
    public word_id: number;
    public question_id: number;
    public count: number;
    public weight: number;
}

Question_reverse_word.init(
    {
        id : {
            type: seq.INTEGER,
            primaryKey: true,
            autoIncrement : true
        },
        word_id:{
            type: seq.INTEGER,
            references: {
                model: 'Question_word',
                key: 'id'
            }
        },
        question_id:{
            type: seq.INTEGER,
            references: {
                model: 'Question',
                key: 'id'
            }
        },
        count:{
            type: seq.INTEGER
        },
        weight:{
            type: seq.DOUBLE
        }
    },{
        modelName: 'Question_reverse_word',
        tableName: 'Question_reverse_word',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);
