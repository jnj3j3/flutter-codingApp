import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/question/board/model/question_board_model.dart';
import 'package:flutter_application_1/utils/backends/like/answer_like.dart';
import 'package:flutter_application_1/utils/backends/select/answer_select.dart';
import 'package:flutter_application_1/utils/design/fonts.dart' as design;
import 'package:flutter_application_1/login/model/user_model.dart';
import 'package:flutter_application_1/question/board/model/answer_model.dart';

Future<List<Function>> commentWidgets(
    String boardId, int page, QuestionBoard? question) async {
  final dio = Dio();
  final response =
      await dio.get('http://100.106.99.20:80/answer/pageBoard/$page/$boardId');
  if (response.statusCode == 200) {
    List<Function> comments = [];
    if (response.data['pageData'] != null) {
      for (var comment in response.data['pageData']) {
        final answer = Answer.fromJson(comment);
        if (answer.is_selected == 1) {
          question != null
              ? comments.add(selectChatBubbleWidget(answer, question))
              : null;
        } else {
          question != null
              ? comments.add(chatBubbleWidget(answer, question))
              : null;
        }
      }
    }
    return comments;
  } else {
    return [];
  }
}

Function selectChatBubbleWidget(Answer answer, QuestionBoard quesiton) {
  Widget selectedChatBubble(
      dynamic userState, Dio dio, VoidCallback onRefreshParent) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        border: Border.all(color: const Color.fromARGB(255, 123, 219, 116)),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(
                Icons.check,
                color: Color.fromARGB(255, 123, 219, 116),
                size: 15,
              ),
              SizedBox(width: 10),
              Text('selected',
                  style: TextStyle(
                      color: Color.fromARGB(255, 123, 219, 116), fontSize: 15))
            ],
          ),
          Text(
            answer.content,
            style: design.boldStyle(20),
          ),
          Text(answer.userName, style: design.boldStyle(15)),
          Row(
            children: [
              const Icon(Icons.favorite, color: Colors.red, size: 15),
              const SizedBox(width: 5),
              Text(answer.like.toString(), style: design.boldStyle(15)),
              const SizedBox(width: 10),
              Text(answer.created, style: design.boldStyle(15)),
              const SizedBox(width: 10),
              userState is UserModel
                  ? LikeContainer(
                      answer: answer,
                      userState: userState,
                      dio: dio,
                      boardId: quesiton.id.toString(),
                      onRefreshParent: onRefreshParent)
                  : Container()
            ],
          )
        ],
      ),
    );
  }

  return selectedChatBubble;
}

Function chatBubbleWidget(Answer answer, QuestionBoard question) {
  Container chatBubble(
      dynamic userState, Dio dio, VoidCallback onRefreshParent) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xffA374DB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 10),
          Text(answer.content, style: design.boldStyle(20)),
          Text(
            answer.userName,
            style: design.boldStyle(15),
          ),
          Row(
            children: [
              const Icon(Icons.favorite, color: Colors.red, size: 15),
              const SizedBox(width: 5),
              Text(answer.like.toString(), style: design.boldStyle(15)),
              const SizedBox(width: 10),
              Text(answer.created, style: design.boldStyle(15)),
              const SizedBox(width: 10),
              userState is UserModel
                  ? Row(children: [
                      LikeContainer(
                        answer: answer,
                        userState: userState,
                        dio: dio,
                        boardId: question.id.toString(),
                        onRefreshParent: onRefreshParent,
                      ),
                      const SizedBox(width: 10),
                      question.isClear == 0 &&
                              userState.nickname == question.userName
                          ? SelectContainer(
                              answer: answer,
                              dio: dio,
                              boardId: question.id.toString(),
                              onRefreshParent: onRefreshParent,
                            )
                          : Container()
                    ])
                  : Container()
            ],
          )
        ],
      ),
    );
  }

  return chatBubble;
}

class LikeContainer extends StatefulWidget {
  final Answer answer;
  final UserModel userState;
  final Dio dio;
  final String boardId;
  final VoidCallback onRefreshParent;
  const LikeContainer({
    required this.answer,
    required this.userState,
    required this.dio,
    required this.boardId,
    required this.onRefreshParent,
    Key? key,
  }) : super(key: key);

  @override
  _LikeContainerState createState() => _LikeContainerState();
}

class _LikeContainerState extends State<LikeContainer> {
  bool checkLike = false;

  @override
  void initState() {
    super.initState();
    // 초기 좋아요 상태 확인
    checkAnswerLike(widget.answer, widget.userState, widget.dio)
        .then((value) => setState(() {
              checkLike = value;
            }));
  }

  @override
  Widget build(BuildContext context) {
    return Center(
        child: Container(
            height: 30,
            width: 30,
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(5),
                border: Border.all(
                    color: checkLike ? Colors.red : Colors.grey, width: 2)),
            alignment: Alignment.center,
            child: IconButton(
              iconSize: 26,
              padding: EdgeInsets.zero,
              icon: Icon(
                Icons.favorite,
                color: checkLike ? Colors.red : Colors.grey,
                size: 26,
              ),
              onPressed: () => {
                setState(() {
                  checkLike = !checkLike;
                  if (checkLike) {
                    likeAnswer(widget.answer, widget.dio)
                        .then((value) => widget.onRefreshParent()); // 좋아요
                  } else {
                    dislikeAnswer(widget.answer, widget.dio)
                        .then((value) => {widget.onRefreshParent()});
                  }
                })
              },
            )));
  }
}

class SelectContainer extends StatefulWidget {
  final Answer answer;
  final Dio dio;
  final String boardId;
  final VoidCallback onRefreshParent;
  const SelectContainer({
    required this.answer,
    required this.dio,
    required this.boardId,
    required this.onRefreshParent,
    Key? key,
  }) : super(key: key);

  @override
  _SelectContainerState createState() => _SelectContainerState();
}

class _SelectContainerState extends State<SelectContainer> {
  @override
  Widget build(BuildContext context) {
    return Center(
        child: Container(
            height: 30,
            width: 30,
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(5),
                border: Border.all(
                    color: const Color.fromARGB(255, 123, 219, 116))),
            alignment: Alignment.center,
            child: IconButton(
              iconSize: 26,
              padding: EdgeInsets.zero,
              icon: const Icon(
                Icons.check,
                color: Color.fromARGB(255, 123, 219, 116),
                size: 26,
              ),
              onPressed: () => {
                selectAnswer(widget.answer, widget.boardId, widget.dio)
                    .then((value) => widget.onRefreshParent())
              },
            )));
  }
}
