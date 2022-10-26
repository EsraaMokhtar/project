const mongoose = require("mongoose");

var QuestionSchema = new mongoose.Schema({
    domain:{
        type: String,
        required: "This Fieled is required"
    },
    content:{
        type: String,
        required: "This Fieled is required"
    },
    userId :{
        type: String,
        required: "This Fieled is required"
    },
    flag:{
        type:Boolean,
        default:false,
    },
    rate:{
        type:Number,
        default:0
    },
    answers :[{
        content:{
            type:String,
        },
        file:{
            type: Object,
        },
        answerWriter:{
            type:String,
        },
        time:{
            type:String,
        },
        userId:{
            type: String,
            required: "This Fieled is required"
        },
        comments:[{
            content:{
                type:String,
            },
            commentWriter:{
                type:String,
            }
        }],
        react:{
            like:{
                numberOfLike:{
                    type:Number,
                    default:0
                },
                admires:[{
                    admireName:String
                }],
            },
            disLike:{
                numberOfDisLike:{
                    type:Number,
                    default:0
                },
                haters:[{
                    haterName:String
                }],
            }, 
        },
    },]
},
{
    collection:"questions",
    versionKey:false,
});

QuestionSchema.index({domain:'text'});

module.exports = mongoose.model('Question', QuestionSchema);
