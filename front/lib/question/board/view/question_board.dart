import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/login/model/user_model.dart';
import 'package:flutter_application_1/login/utils/dio/dio.dart';
import 'package:flutter_application_1/utils/design/appBar/appBar.dart'
    as appBar;
import 'package:flutter_application_1/utils/design/appBar/drawer.dart';
import 'package:flutter_application_1/utils/design/fonts.dart' as design;
import 'package:flutter_application_1/login/provider/user_me_provider.dart';
import 'package:flutter_application_1/question/board/model/question_board_model.dart';
import 'package:flutter_application_1/question/board/pagination/comment.dart';
import 'package:flutter_application_1/question/board/view/question_board_title.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:comment_box/comment/comment.dart';

class QuesitonBoardWidget extends ConsumerStatefulWidget {
  String boardId;
  QuesitonBoardWidget(this.boardId, {super.key});
  @override
  _QuestionBoardWidgetState createState() => _QuestionBoardWidgetState();
}

class _QuestionBoardWidgetState extends ConsumerState<QuesitonBoardWidget> {
  ScrollController controller = ScrollController();
  @override
  void initState() {
    super.initState();
  }

  final TextEditingController commentController = TextEditingController();
  final formKey = GlobalKey<FormState>();
  @override
  Widget build(BuildContext context) {
    final userState = ref.watch(userMeProvider);
    final dio = ref.watch(dioProvider);
    return Scaffold(
        backgroundColor: Colors.black87,
        appBar: appBar.appBarContainer(context, ref, true),
        endDrawer: Drawer(child: navigationBar(ref, context)),
        body: userState is UserModel
            ? CommentBox(
                labelText: 'Write a comment',
                errorText: 'Comment cannot be blank',
                withBorder: false,
                sendButtonMethod: () async {
                  if (formKey.currentState!.validate()) {
                    try {
                      final response = await dio.post(
                        'http://100.106.99.20:80/answer/createAnswer',
                        data: {
                          'content': commentController.text,
                          'answerId': widget.boardId,
                        },
                        options: Options(headers: {
                          'accessToken': 'true',
                        }),
                      );

                      if (response.statusCode == 200) {
                        commentController.clear();
                        FocusScope.of(context).unfocus();
                        context.push('/questionBoard/${widget.boardId}');
                      } else {
                        throw Exception('Failed to post comment');
                      }
                    } catch (err) {
                      showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return AlertDialog(
                              backgroundColor:
                                  const Color.fromARGB(1000, 24, 31, 41),
                              title: const Icon(Icons.error_outline,
                                  color: Colors.red, size: 80.0),
                              content: Text(
                                'fail to post comment',
                                style: design.boldStyle(30),
                                textAlign: TextAlign.center,
                              ),
                              actions: <Widget>[
                                TextButton(
                                  onPressed: () {
                                    Navigator.of(context).pop();
                                  },
                                  child: Text(
                                    'OK',
                                    style: design.boldStyle(15),
                                  ),
                                ),
                              ],
                            );
                          });
                    }
                  }
                },
                formKey: formKey,
                commentController: commentController,
                backgroundColor: Colors.black87,
                textColor: Colors.white,
                sendWidget:
                    const Icon(Icons.send_sharp, size: 30, color: Colors.white),
                child: QuestionBoardWidget(widget.boardId),
              )
            : QuestionBoardWidget(widget.boardId));
  }
}

class QuestionBoardWidget extends ConsumerStatefulWidget {
  String boardId;
  QuestionBoardWidget(this.boardId, {super.key});
  @override
  _questionBoardWidgetState createState() => _questionBoardWidgetState();
}

class _questionBoardWidgetState extends ConsumerState<QuestionBoardWidget> {
  ScrollController controller = ScrollController();
  final dio = Dio();
  Response<dynamic>? response;
  List<Function> comments = [];
  int page = 0;
  bool end = false;
  QuestionBoard? question;
  @override
  void initState() {
    super.initState();
    dio
        .get('http://100.106.99.20:80/question/findQuestion/${widget.boardId}')
        .then((value) => {
              if (value.statusCode != 200)
                showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        backgroundColor: const Color.fromARGB(1000, 24, 31, 41),
                        title: const Icon(Icons.error_outline,
                            color: Colors.red, size: 80.0),
                        content: Text(
                          'fail to load post',
                          style: design.boldStyle(30),
                          textAlign: TextAlign.center,
                        ),
                        actions: <Widget>[
                          TextButton(
                            onPressed: () {
                              Navigator.of(context)
                                  .popUntil((route) => route.isFirst);
                            },
                            child: Text(
                              'OK',
                              style: design.boldStyle(15),
                            ),
                          ),
                        ],
                      );
                    })
              else
                {
                  setState(() {
                    response = value;
                    if (response != null) {
                      question = QuestionBoard.fromJson(response!.data);
                    }
                  }),
                  commentWidgets(widget.boardId, page, question)
                      .then((value) => {
                            setState(() {
                              page++;
                              if (value.isEmpty) {
                                end = true;
                              } else {
                                comments = value;
                              }
                            })
                          })
                }
            });

    controller.addListener((() {
      if (controller.position.maxScrollExtent == controller.position.pixels &&
          !end) {
        commentWidgets(widget.boardId, page, question).then((value) {
          setState(() {
            page++;
            if (value.isEmpty) {
              end = true;
            }
            comments.addAll(value);
          });
        });
      }
    }));
  }

  @override
  void dispose() {
    super.dispose();
    controller.dispose();
    comments.clear();
  }

  @override
  Widget build(BuildContext context) {
    final userState = ref.watch(userMeProvider);
    final dioState = ref.watch(dioProvider);
    void refreshParent() {
      context.push('/questionBoard/${widget.boardId}');
    }

    return response != null
        ? ListView.separated(
            separatorBuilder: (context, index) => const SizedBox(height: 10),
            controller: controller,
            itemCount: comments.length + 3,
            itemBuilder: (context, index) {
              if (index == 0) {
                return QuestionBoardTitle(
                    questionBoard: QuestionBoard.fromJson(response!.data));
              } else if (index == 1) {
                return Column(children: [
                  Container(
                    padding: const EdgeInsets.only(top: 10, bottom: 10),
                    alignment: Alignment.topLeft,
                    child: Text(
                      response!.data['content'],
                      style: design.boldStyle(25),
                    ),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  const Divider(
                    height: 1.0,
                    color: Colors.grey,
                  ),
                ]);
              } else if (index == comments.length + 2) {
                return end
                    ? Container(
                        alignment: Alignment.center,
                        padding: const EdgeInsets.only(top: 10, bottom: 10),
                        child: Text(
                          'end',
                          style: design.boldStyle(25),
                        ),
                      )
                    : Container(
                        alignment: Alignment.center,
                        padding: const EdgeInsets.only(top: 10, bottom: 10),
                        child: const CircularProgressIndicator(),
                      );
              } else {
                return comments[index - 2](userState, dioState, refreshParent);
              }
            },
          )
        : Container();
  }
}
