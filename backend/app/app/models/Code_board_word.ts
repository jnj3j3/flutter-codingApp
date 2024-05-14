import { sequelize, seq } from "./db.config";

interface  Code_board_wordAttributes {
    id: number,
    word: string,
    count: number
}

export class Code_board_word extends seq.Model<Code_board_wordAttributes> implements Code_board_wordAttributes{
    public readonly id: number;
    public word: string;
    public count: number;
}

Code_board_word.init(
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
        modelName: 'Code_board_word',
        tableName: 'Code_board_word',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);
