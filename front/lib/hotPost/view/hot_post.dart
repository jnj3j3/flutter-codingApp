import 'package:dio/dio.dart';
import 'package:flutter_application_1/utils/design/fonts.dart' as design;
import 'package:flutter_application_1/hotPost/model/hot_board.dart';
import 'package:flutter_application_1/hotPost/model/hot_question.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:go_router/go_router.dart';
import '../../utils/design/icon.dart';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/question/board/view/question_board.dart'
    as questionBoard;

final baseUrl = dotenv.env['BaseURL'];

Future<List<Widget>> hotPost(bool isPost, BuildContext context) async {
  try {
    List<Widget> widgetList = [];
    final dio = Dio();
    final response = isPost
        ? await dio.get('$baseUrl/code_board/hotBoard')
        : await dio.get('$baseUrl/question/hotQuestion');
    if (response.statusCode == 200) {
      response.data.forEach((element) {
        if (element != null) {
          widgetList.add(isPost
              ? hotBoardWidget(element, context)
              : hotQuestionWidget(element, context));
        }
      });
      if (widgetList.isEmpty) {
        widgetList.add(Container(
            decoration: design.boxDecoration(),
            child: Center(
                child: Text(
              'no post yet',
              style: design.textStyle(35.0),
            ))));
      }
      return widgetList;
    } else {
      return [
        Container(
          decoration: design.boxDecoration(),
          child: Center(
              child: Text(
            'fail to load post',
            style: design.textStyle(35.0),
          )),
        )
      ];
    }
  } catch (err) {
    print(err);
    return [
      Container(
        decoration: design.boxDecoration(),
        child: Center(
            child: Text(
          'error occurred!',
          style: design.textStyle(35.0),
        )),
      )
    ];
  }
}

Widget post(
    {required String title,
    required int id,
    required String userName,
    required BuildContext context,
    required List<Widget> widgetList}) {
  title = title.length > 17 ? "${title.substring(0, 14)}......" : title;
  return InkWell(
    onTap: () => context.go('/questionBoard/$id'),
    child: Container(
      decoration: design.boxDecoration(),
      child: Container(
          margin: const EdgeInsets.only(left: 10),
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            Container(
                alignment: Alignment.centerLeft,
                child: Text(
                  title,
                  style: design.boldStyle(30.0),
                )),
            const SizedBox(height: 10),
            Row(mainAxisAlignment: MainAxisAlignment.start, children: [
              const Icon(
                Icons.person,
                color: Colors.white,
                size: 15,
              ),
              Text(
                userName,
                style: design.boldStyle(15.0),
              ),
              Row(
                children: widgetList,
              )
            ])
          ])),
    ),
  );
}

Widget hotBoardWidget(dynamic board, BuildContext context) {
  final hotBoardClass = HotBoard.fromJson(board);
  List<Widget> children = [
    const Icon(
      Icons.favorite,
      color: Colors.white,
      size: 15,
    ),
    Text(
      " " + hotBoardClass.like.toString(),
      style: design.boldStyle(15.0),
    ),
    Text("   language:  ", style: design.boldStyle(15.0)),
    Container(
      width: 15,
      child: getIcon(hotBoardClass.language),
      margin: EdgeInsets.only(right: 10),
    )
  ];
  return post(
      title: hotBoardClass.title,
      id: hotBoardClass.id,
      userName: hotBoardClass.userName,
      context: context,
      widgetList: children);
}

Widget hotQuestionWidget(dynamic board, BuildContext context) {
  final hotquestion = HotQuestion.fromJson(board);
  print(hotquestion.isClear);
  bool isClear = hotquestion.isClear == 1;
  List<Widget> children = [
    const Icon(Icons.favorite, color: Colors.white, size: 15),
    Text(
      " " + hotquestion.like.toString() + "   ",
      style: design.boldStyle(15.0),
    ),
    const Icon(Icons.remove_red_eye_outlined, color: Colors.white, size: 20),
    Text(
      " " + hotquestion.views.toString() + "  ",
      style: design.boldStyle(15.0),
    ),
    isClear
        ? const Row(
            children: [
              Icon(Icons.check, color: Colors.green, size: 15.0),
              Text(
                "clear",
                style: TextStyle(
                  fontSize: 15.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.green,
                ),
              )
            ],
          )
        : Row(
            children: [
              const Icon(
                Icons.question_mark_rounded,
                color: Colors.red,
                size: 15,
              ),
              Text(
                "notClear",
                style: design.redBoldStyle(15),
              )
            ],
          ),
    const SizedBox(width: 10),
  ];
  return post(
      title: hotquestion.title,
      id: hotquestion.id,
      userName: hotquestion.userName,
      context: context,
      widgetList: children);
}
