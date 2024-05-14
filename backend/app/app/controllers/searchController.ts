require("dotenv").config();
import {db} from '../models/index';
const Question_word = db.Question_word;
const Question_reverse_word = db.Question_reverse_word;
const Code_board_word = db.Code_board_word;
const Code_board_reverse_word = db.Code_board_reverse_word;
const sequelize = db.sequelize;
import { Transaction } from 'sequelize';

export function search(sentence:string,tableName:string):Promise<any>{
    return new Promise(async (resolve,reject)=>{
        try{
            const dataMap = new Map<any,number>();
            for(const word of slice_sentence([sentence]).entries()){
                const wordData = tableName==="question"? await Question_word.findOne({where:{word:word[0]}}).catch(err=>{throw new Error(err)})
                : await Code_board_word.findOne({where:{word:word[0]}}).catch(err=>{throw new Error(err)});
                if(wordData){
                    const reverse_wordData = tableName==="question"? await Question_reverse_word.findAll({where:{word_id:wordData.id}})
                    .catch(err=>{throw new Error(err)})
                    : await Code_board_reverse_word.findAll({where:{word_id:wordData.id}}).catch(err=>{throw new Error(err)});
                    if(reverse_wordData) {
                        reverse_wordData.forEach((data)=>{
                            switch (tableName) {
                                case "question":
                                    if(dataMap.has(data.question_id)) dataMap.set(data.question_id,dataMap.get(data.question_id)+(data.weight*word[1]));
                                    else dataMap.set(data.question_id,(data.weight*word[1]));
                                    break;
                                default:
                                    if(dataMap.has(data.code_board_id)) dataMap.set(data.code_board_id,dataMap.get(data.code_board_id)+(data.weight*word[1]));
                                    else dataMap.set(data.code_board_id,(data.weight*word[1])); 
                                    break;
                            }
                            
                        })
                    }
                }
            }
            const array = [...dataMap]
            array.sort((a,b)=>{return b[1]-a[1]})
            return resolve(array);
        }catch(err){
            return reject(err);
        }
    })
}

export  function create_word(sentences:Array<string>,table_id:number,tableName:string,transaction:Transaction):Promise<boolean>{
    return  new Promise(async (resolve,reject)=>{
        try{
            var map:Map<string,number> = await slice_sentence(sentences);
            for(let mapData of map.entries()){
                var wordData = tableName==="question"?await Question_word.findOne({where:{word:mapData[0]},transaction:transaction})
                .catch(err=>{throw new Error(err)})
                : await Code_board_word.findOne({where:{word:mapData[0]},transaction:transaction}).catch(err=>{throw new Error(err)});
                var plusCount:number;
                if(!wordData) {
                    wordData = tableName==="question"? await  Question_word.create({word:mapData[0],count:mapData[1]},{transaction:transaction})
                    .catch(err=>{throw new Error(err)})
                    : await Code_board_word.create({word:mapData[0],count:mapData[1]},{transaction:transaction}).catch(err=>{throw new Error(err)});
                    plusCount = mapData[1]
                }else {
                    plusCount = wordData.count+mapData[1];
                    tableName==="question"?await Question_word.update({count:plusCount},{where:{word:mapData[0]},transaction:transaction})
                    .catch(err=>{throw new Error(err)})
                    : await Code_board_word.update({count:plusCount},{where:{word:mapData[0]},transaction:transaction}).catch(err=>{throw new Error(err)});
                }
                tableName==="question"?await Question_reverse_word.create({question_id:table_id,
                    word_id:wordData.id,count:mapData[1],
                    weight:mapData[1]/Math.log(plusCount+1.0)},{transaction:transaction})
                    .catch(err=>{throw new Error(err)})
                : await Code_board_reverse_word.create({code_board_id:table_id,
                    word_id:wordData.id,count:mapData[1],
                    weight:mapData[1]/Math.log(plusCount+1.0)},{transaction:transaction})
                    .catch(err=>{throw new Error(err)});
            }
            return resolve(true);
        }catch(err){
            return reject(err);
        }
    })

}

export function delete_word(tableId:number,tableName:string,transaction:Transaction):Promise<boolean>{
    return new Promise(async(resolve,reject)=>{
        try{
            tableName==="question"?await Question_reverse_word.destroy({where:{question_id:tableId},transaction:transaction})
            .catch(err=>{throw new Error(err)})
            : await Code_board_reverse_word.destroy({where:{code_board_id:tableId},transaction:transaction})
            .catch(err=>{throw new Error(err)});
            return resolve(true);
        }catch(err){
            return reject(err);
        }
    })
}

function slice_sentence(sentences:Array<string>):Map<string,number>{
    const chunks: string[]=[];
    const map = new Map<string,number>();
    sentences.forEach((sentence)=>{
        sentence = sentence.replace(/\s/g, "").toLowerCase()
        for (let i = 0; i < sentence.length; i += 1) {
            chunks.push(sentence.slice(i, i + 2));
        }
        chunks.forEach((chunk)=>{
            if(map.has(chunk)) map.set(chunk,map.get(chunk)+1);
            else map.set(chunk,1);
        })
    })
    return map
}