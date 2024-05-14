import { sequelize, seq } from "./db.config";

interface  Question_wordAttributes {
    id: number,
    word: string,
    count: number
}

export class Question_word extends seq.Model<Question_wordAttributes> implements Question_wordAttributes{
    public readonly id: number;
    public word: string;
    public count: number;
}

Question_word.init(
    {
        id : {
            type: seq.INTEGER,
            primaryKey: true,
            autoIncrement : true
        },
        word:{
            type: seq.STRING
        },
        count:{
            type: seq.INTEGER
        }
    },{
        modelName: 'Question_word',
        tableName: 'Question_word',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);
