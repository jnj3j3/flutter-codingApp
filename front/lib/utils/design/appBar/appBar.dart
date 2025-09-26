import 'package:flutter/material.dart';
import 'package:flutter_application_1/utils/design/fonts.dart' as design;
import 'package:flutter_application_1/login/model/user_model.dart';
import 'package:flutter_application_1/login/provider/user_me_provider.dart';
import 'package:flutter_application_1/main.dart';
import 'package:flutter_application_1/utils/provider/router_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

IconButton loginButton(BuildContext context) {
  return IconButton(
      icon: const Icon(Icons.login_rounded, color: Colors.white),
      tooltip: 'login',
      onPressed: () => context.go('/login'));
}

IconButton userButton(BuildContext context) {
  return IconButton(
      icon: const Icon(Icons.person, color: Colors.white),
      tooltip: 'user',
      onPressed: () {
        Scaffold.of(context).openEndDrawer();
      });
}

AppBar appBarContainer(BuildContext context, WidgetRef ref, bool showDrawer) {
  final state = ref.watch(userMeProvider);
  // checkToken
  return AppBar(
    automaticallyImplyLeading: false,
    title: InkWell(
      onTap: () => context.go('/'),
      child: Text.rich(
        TextSpan(children: [
          WidgetSpan(
              child: Container(
                  height: 30,
                  margin: const EdgeInsets.only(right: 5),
                  child: Image.asset('assets/icons/1-removebg-preview.png'))),
          TextSpan(text: 'Ju_Coding', style: design.textStyle(30)),
        ]),
        textAlign: TextAlign.center,
      ),
    ),
    actions: showDrawer
        ? [
            Builder(builder: (context) {
              return state is UserModel
                  ? userButton(context)
                  : loginButton(context);
            })
          ]
        : [],
    backgroundColor: const Color.fromARGB(1000, 24, 31, 41),
    iconTheme: const IconThemeData(color: Colors.white),
  );
}
