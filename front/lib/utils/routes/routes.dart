import 'package:flutter_application_1/code/board/codePage.dart';
import 'package:flutter_application_1/login/view/login_page.dart';
import 'package:flutter_application_1/main.dart';
import 'package:flutter_application_1/question/board/view/question_board.dart';
import 'package:flutter_application_1/utils/error/errorPage.dart';
import 'package:go_router/go_router.dart';

List<RouteBase> routes = [
  GoRoute(
      path: '/',
      name: 'homePage',
      builder: (context, state) => const HomePage()),
  GoRoute(
    path: '/login',
    name: 'loginPage',
    builder: (context, state) => const LoginPageWidget(),
  ),
  GoRoute(
    path: '/questionBoard/:id',
    name: 'questionBoardPage',
    builder: (context, state) {
      if (state.pathParameters['id'] != null) {
        return QuesitonBoardWidget(state.pathParameters['id']!);
      } else {
        return errorPage();
      }
    },
  ),
  GoRoute(
      path: '/codeBoard',
      name: 'codeBoardPage',
      builder: (context, state) => const CodePage()),
];
