import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/question/board/model/question_board_model.dart';
import 'package:flutter_application_1/utils/design/fonts.dart' as design;

class QuestionBoardTitle extends StatelessWidget {
  final QuestionBoard questionBoard;
  QuestionBoardTitle({required this.questionBoard});
  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.all(0),
      title: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(
          questionBoard.title,
          style: design.boldStyle(40),
        ),
        Text(
          questionBoard.userName,
          style: design.boldStyle(15),
        ),
        Text(
          questionBoard.created,
          style: design.boldStyle(15),
        ),
        Row(children: [
          const Icon(
            Icons.favorite,
            color: Colors.red,
            size: 10,
          ),
          const SizedBox(width: 5),
          Text(
            questionBoard.like.toString(),
            style: design.boldStyle(15),
          ),
          const SizedBox(width: 10),
          const Icon(
            Icons.remove_red_eye_outlined,
            color: Colors.white,
            size: 10,
          ),
          const SizedBox(width: 5),
          Text(
            questionBoard.views.toString(),
            style: design.boldStyle(15),
          ),
        ]),
        const Divider(
          height: 1.0,
          color: Colors.grey,
        ),
      ]),
    );
  }
}
