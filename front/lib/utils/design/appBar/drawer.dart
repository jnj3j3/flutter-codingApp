import 'package:flutter/material.dart';
import 'package:flutter_application_1/utils/design/fonts.dart';
import 'package:flutter_application_1/login/model/user_model.dart';
import 'package:flutter_application_1/login/provider/user_me_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

Widget navigationBar(WidgetRef ref, BuildContext context) {
  final state = ref.watch(userMeProvider);
  return state is UserModel
      ? Container(
          color: Colors.black87,
          child: ListView(
            padding: EdgeInsets.zero,
            children: [
              DrawerHeader(
                decoration: const BoxDecoration(
                  color: Color.fromARGB(1000, 24, 31, 41),
                ),
                child: Column(
                  children: <Widget>[
                    Expanded(
                        flex: 5,
                        child: Container(
                            alignment: Alignment.center,
                            child: const Icon(
                              Icons.account_circle,
                              color: Colors.white,
                              size: 80,
                            ))),
                    Expanded(
                        flex: 5,
                        child: Container(
                            alignment: Alignment.center,
                            child: Text(
                              state.nickname,
                              style: boldStyle(30),
                            )))
                  ],
                ),
              ),
              ListTile(
                title: Row(children: [
                  const Icon(Icons.account_circle, color: Colors.white),
                  const SizedBox(width: 10),
                  Text('My Page', style: textStyle(20))
                ]),
                onTap: () {},
              ),
              ListTile(
                title: Row(children: [
                  const Icon(Icons.code_off, color: Colors.white),
                  const SizedBox(width: 10),
                  Text('My codes', style: textStyle(20))
                ]),
                onTap: () {},
              ),
              ListTile(
                title: Row(children: [
                  const Icon(Icons.question_answer, color: Colors.white),
                  const SizedBox(width: 10),
                  Text('My Questions', style: textStyle(20))
                ]),
                onTap: () {},
              ),
              const Spacer(),
              const Divider(
                height: 1.0,
                color: Colors.grey,
              ),
              ListTile(
                title: Row(children: [
                  const Icon(Icons.logout, color: Colors.white),
                  const SizedBox(width: 10),
                  Text('Logout', style: textStyle(20))
                ]),
                onTap: () {
                  context.pop();
                  ref.read(userMeProvider.notifier).logout();
                  context.go("/");
                },
              )
            ],
          ))
      : Container();
}
